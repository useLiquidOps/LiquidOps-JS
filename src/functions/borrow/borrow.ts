import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import {
  TransactionResult,
  validateTransaction,
  findTransactionIds,
} from "../../ao/messaging/validationUtils";
import { getTags } from "../../arweave/getTags";
import { WithResultOption } from "../utils/getResult";

export const BORROW_CONFIG = {
  action: "Borrow",
  expectedTxCount: 2,
  confirmationTag: "Borrow-Confirmation",
  requiredNotices: ["Transfer", "Borrow-Confirmation"],
  requiresCreditDebit: true,
};

export type Borrow = WithResultOption<{
  token: TokenInput;
  quantity: BigInt;
}>;

export interface BorrowRes extends TransactionResult {}

export async function borrow<T extends Borrow>(
  aoUtils: AoUtils,
  { token, quantity, noResult = false }: Borrow,
): Promise<T["noResult"] extends true ? string : BorrowRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { oTokenAddress, tokenAddress } = tokenInput(token);

    const transferID = await aoUtils.message({
      process: oTokenAddress,
      tags: [
        { name: "Action", value: "Borrow" },
        { name: "Quantity", value: quantity.toString() },
        { name: "Protocol-Name", value: "LiquidOps" },
        { name: "Analytics-Tag", value: "Borrow" },
        { name: "timestamp", value: JSON.stringify(Date.now()) },
        { name: "token", value: tokenAddress },
      ],
      signer: aoUtils.signer,
    });

    if (noResult) {
      return transferID as any;
    }

    const transferResult = await validateTransaction(
      aoUtils,
      transferID,
      oTokenAddress,
      BORROW_CONFIG,
    );

    if (transferResult === "pending") {
      return {
        status: "pending",
        transferID,
        response: "Transaction pending.",
      } as any;
    }

    if (!transferResult) {
      throw new Error("Transaction validation failed");
    }

    // Find the extra transfer transaction ID
    const transferTxnId = await findExtraBorrowTransfer(
      aoUtils,
      transferID,
      oTokenAddress,
    );

    if (transferTxnId === "pending") {
      return {
        status: "pending",
        transferID,
        response: "Transfer transaction pending.",
      } as any;
    }

    // Find credit/debit notices from the transfer, but using the old transaction ID
    const transactionIds = await findTransactionIds(
      aoUtils,
      transferID,
      tokenAddress,
    );

    return {
      status: true,
      ...transactionIds,
      transferID,
    } as any;
  } catch (error) {
    throw new Error("Error in borrow function: " + error);
  }
}

async function findExtraBorrowTransfer(
  aoUtils: AoUtils,
  transferID: string,
  oTokenAddress: string,
  maxRetries = 10,
  retryInterval = 6000,
): Promise<string | "pending"> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const transferTxns = await getTags({
        aoUtils,
        tags: [
          { name: "Pushed-For", values: transferID },
          { name: "Action", values: "Transfer" },
          { name: "From-Process", values: oTokenAddress },
        ],
        cursor: "",
      });

      if (!transferTxns?.edges?.[0]?.node?.id) {
        throw new Error("Could not find transfer transaction");
      }

      return transferTxns.edges[0].node.id;
    } catch (error) {
      if (attempt === maxRetries) return "pending";
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
  return "pending";
}
