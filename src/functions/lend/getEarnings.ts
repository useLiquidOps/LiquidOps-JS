import { AoUtils, connectToAO } from "../../ao/utils/connect";
import { getTags } from "../../arweave/getTags";
import {
  getTransactions,
  Transaction,
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

  // get lends and unlends
  const [lends, unlends] = await Promise.all([
    getTransactions(aoUtils, {
      token,
      action: "lend",
      walletAddress,
    }),
    getTransactions(aoUtils, {
      token,
      action: "unLend",
      walletAddress,
    }),
  ]);

  // get lend and unlend confirmations
  const [lendConfirmations, unlendConfirmations] = await Promise.all([
    getTags({
      aoUtils,
      tags: [
        { name: "Action", values: "Mint-Confirmation" },
        { name: "Pushed-For", values: lends.transactions.map((t) => t.id) },
      ],
      cursor: "",
    }),
    getTags({
      aoUtils,
      tags: [
        { name: "Action", values: "Redeem-Confirmation" },
        { name: "Pushed-For", values: unlends.transactions.map((t) => t.id) },
      ],
      cursor: "",
    }),
  ]);

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

  return {
    base,
    profit: collateralization - base,
  };
}
