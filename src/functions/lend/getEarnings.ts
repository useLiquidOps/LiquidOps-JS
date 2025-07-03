import { AoUtils, connectToAO } from "../../ao/utils/connect";
import { getTags } from "../../arweave/getTags";
import {
  getTransactions,
  GetTransactionsRes,
  Transaction,
} from "../getTransactions/getTransactions";
import { GQLEdgeInterface, GQLTransactionsResultInterface } from "ar-gql/dist/faces";

export interface GetEarnings {
  walletAddress: string;
  token: string;
  collateralization?: bigint;
}

export interface GetEarningsRes {
  base: bigint;
  profit: bigint;
  startDate?: number;
}

interface Action {
  action: "lend" | "unlend";
  qty: bigint;
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
    };
  }

  let actions: Action[] = [];

  let lendCursor: string | undefined;
  let redeemCursor: string | undefined;
  let hasNextPage = true;
  // let cursor = "";

  // while (hasNextPage) {
  //   const res = await getTags({
  //     aoUtils,
  //     tags: [
  //       { name: "Action", values: ["Transfer", "Redeem"] },
  //       { name: "" }
  //     ],
  //     cursor,
  //     owner: walletAddress
  //   });


  // }

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

    const newActions: Action[] = [];
    let i = 0, j = 0;

    while (i < lendRequests.transactions.length && j < unlendRequests.transactions.length) {
      if (lendRequests.transactions[i].block.timestamp >= unlendRequests.transactions[j].block.timestamp) {
        const tx = lendRequests.transactions[i++];

        if (hasConfirmationPredicate(tx.id, lendConfirmations)) {
          newActions.push({
            action: "lend",
            qty: BigInt(tx.tags.Quantity || "0")
          });
        }
      } else {
        const tx = unlendRequests.transactions[j++];

        if (hasConfirmationPredicate(tx.id, unlendConfirmations)) {
          newActions.push({
            action: "unlend",
            qty: BigInt(tx.tags.Quantity || "0")
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

    if (action.action === "lend") {
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

  console.log("user principal", userPrincipal)
  console.log("profit", profit)
  console.log("total earned interest", totalEarnedInterest)


/*
  // reducer function for a list of lends/unlends based on a
  // list of mint/redeem confirmations
  // it adds together the quantities if they have a confirmation
  const sumIfSuccessfull = (confirmations: GQLTransactionsResultInterface) => {
    return (prev: bigint, curr: Transaction) => {
      // check if it was a successfull interaction (received confirmation)
      if (
        !confirmations.edges.find(
          (tx) =>
            tx.node.tags.find((t) => t.name === "Pushed-For")?.value ===
            curr.id,
        )
      ) {
        return prev;
      }

      // add together
      return prev + BigInt(curr.tags.Quantity || 0);
    };
  };

  // deposited tokens (sum of successfull lends)
  const sumDeposited = lends.transactions.reduce(
    sumIfSuccessfull(lendConfirmations),
    BigInt(0),
  );

  // withdrawn tokens (sum of successfull burns)
  const sumWithdrawn = unlends.transactions.reduce(
    sumIfSuccessfull(unlendConfirmations),
    BigInt(0),
  );

  // the result of the total deposited and total withdrawn tokens
  // is the amount of tokens that the user has in the pool, that
  // they have deposited (without the interest!!)
  const base = sumDeposited - sumWithdrawn;

  // the first mint date
  const startDate =
    lendConfirmations?.edges?.[lendConfirmations?.edges?.length - 1 || 0]?.node
      ?.block?.timestamp;*/

  return {
    base: BigInt(0),
    profit: BigInt(0),
    startDate: 0,
  };
}
