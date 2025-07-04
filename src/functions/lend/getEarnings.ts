import { AoUtils, connectToAO } from "../../ao/utils/connect";
import { getTags } from "../../arweave/getTags";
import {
  getTransactions,
  GetTransactionsRes,
} from "../getTransactions/getTransactions";
import { GQLTransactionsResultInterface } from "ar-gql/dist/faces";

export interface GetEarnings {
  walletAddress: string;
  token: string;
  collateralization?: bigint;
}

export interface GetEarningsRes {
  base: bigint;
  profit: bigint;
  totalEarnedInterest: bigint;
  startDate?: number;
}

interface Event {
  type: "lend" | "unlend";
  qty: bigint;
  date: number;
}

export async function getEarnings(
  aoUtilsInput: Pick<AoUtils, "signer" | "configs">,
  { walletAddress, token, collateralization }: GetEarnings,
): Promise<GetEarningsRes> {
  if (!walletAddress || !token) {
    throw new Error("Please specify a token and a wallet address");
  }

  const { spawn, message, result } = await connectToAO(aoUtilsInput.configs);

  const aoUtils: AoUtils = {
    spawn,
    message,
    result,
    signer: aoUtilsInput.signer,
    configs: aoUtilsInput.configs,
  };

  if (!collateralization || collateralization === BigInt(0)) {
    return {
      base: BigInt(0),
      profit: BigInt(0),
      totalEarnedInterest: BigInt(0),
    };
  }

  let actions: Event[] = [];

  let lendCursor: string | undefined;
  let redeemCursor: string | undefined;
  let hasNextPage = true;

  while (hasNextPage) {
    // get lends and unlends
    const [lendRequests, unlendRequests]: [GetTransactionsRes, GetTransactionsRes] = await Promise.all([
      getTransactions(aoUtils, {
        token,
        action: "lend",
        walletAddress,
        cursor: lendCursor
      }),
      getTransactions(aoUtils, {
        token,
        action: "unLend",
        walletAddress,
        cursor: redeemCursor
      }),
    ]);

    // get lend and unlend confirmations
    const [lendConfirmations, unlendConfirmations] = await Promise.all([
      getTags({
        aoUtils,
        tags: [
          { name: "Action", values: "Mint-Confirmation" },
          { name: "Pushed-For", values: lendRequests.transactions.map((t) => t.id) },
        ],
        cursor: "",
      }),
      getTags({
        aoUtils,
        tags: [
          { name: "Action", values: "Redeem-Confirmation" },
          { name: "Pushed-For", values: unlendRequests.transactions.map((t) => t.id) },
        ],
        cursor: "",
      }),
    ]);

    const hasConfirmationPredicate = (id: string, confirmations: GQLTransactionsResultInterface) =>
      !!confirmations.edges.find(tx => tx.node.tags.find((t) => t.name === "Pushed-For")?.value === id);

    const newActions: Event[] = [];
    let i = 0, j = 0;

    while (i < lendRequests.transactions.length && j < unlendRequests.transactions.length) {
      if (lendRequests.transactions[i].block.timestamp >= unlendRequests.transactions[j].block.timestamp) {
        const tx = lendRequests.transactions[i++];

        if (hasConfirmationPredicate(tx.id, lendConfirmations)) {
          newActions.push({
            type: "lend",
            qty: BigInt(tx.tags.Quantity || "0"),
            date: tx.block.timestamp
          });
        }
      } else {
        const tx = unlendRequests.transactions[j++];

        if (hasConfirmationPredicate(tx.id, unlendConfirmations)) {
          newActions.push({
            type: "unlend",
            qty: BigInt(tx.tags.Quantity || "0"),
            date: tx.block.timestamp
          });
        }
      }
    }

    actions = actions.concat(
      newActions
    );

    lendCursor = lendRequests.pageInfo.cursor;
    redeemCursor = unlendRequests.pageInfo.cursor;
    hasNextPage = lendRequests.pageInfo.hasNextPage || unlendRequests.pageInfo.hasNextPage;
  }

  // loop over user interactions from the very first interaction (reverse)
  // and track deposits, withdraws and interest withdraws
  let userPrincipal = BigInt(0);
  let withdrawnInterest = BigInt(0);

  for (let i = actions.length - 1; i >= 0; i--) {
    const action = actions[i];

    if (action.type === "lend") {
      userPrincipal += action.qty;
    } else {
      if (action.qty <= userPrincipal) {
        userPrincipal -= action.qty;
      } else {
        withdrawnInterest += action.qty - userPrincipal;
        userPrincipal = BigInt(0);
      }
    }
  }

  const profit = collateralization - userPrincipal;
  const totalEarnedInterest = profit + withdrawnInterest;

  // the first mint date
  const startDate = actions[actions.length - 1]?.date;

  return {
    base: userPrincipal,
    profit,
    totalEarnedInterest,
    startDate,
  };
}
