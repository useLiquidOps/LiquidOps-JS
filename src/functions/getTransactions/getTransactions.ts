import { aoUtils } from "../..";
import { getTags, Transaction } from "../../arweave/getTags";

export interface GetTransactions {
  walletAddress: string;
}

export async function getTransactions(
  aoUtils: aoUtils,
  { walletAddress }: GetTransactions,
): Promise<{ node: Transaction }[]> { // TODO: change to txn array instead of node?
  try {
    const tags = [{ name: "", values: [""] }]; // TODO

    return await getTags(aoUtils, tags, walletAddress);
  } catch (error) {
    console.log(error);
    throw new Error("Error in get transactions");
  }
}
