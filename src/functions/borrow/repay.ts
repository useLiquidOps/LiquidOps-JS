import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import {
  TransactionResult,
  validateTransaction,
  findTransactionIds,
} from "../../ao/messaging/validationUtils";
import { WithResultOption } from "../utils/getResult";

export const REPAY_CONFIG = {
  action: "Repay",
  expectedTxCount: 2,
  confirmationTag: "Repay-Confirmation",
  requiredNotices: ["Debit-Notice", "Credit-Notice"],
  requiresCreditDebit: true,
};

export type Repay = WithResultOption<{
  token: TokenInput;
  quantity: BigInt;
  onBehalfOf?: string;
}>;

export interface RepayRes extends TransactionResult {}

export async function repay<T extends Repay>(
  aoUtils: AoUtils,
  { token, quantity, onBehalfOf, noResult = false }: T,
): Promise<T["noResult"] extends true ? string : RepayRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { tokenAddress, oTokenAddress } = tokenInput(token);

    const transferID = await aoUtils.message({
      process: tokenAddress,
      tags: [
        { name: "Action", value: "Transfer" },
        { name: "Quantity", value: quantity.toString() },
        { name: "Recipient", value: oTokenAddress },
        { name: "X-Action", value: "Repay" },
        { name: "Protocol-Name", value: "LiquidOps" },
        ...(onBehalfOf ? [{ name: "X-On-Behalf", value: onBehalfOf }] : []),
        { name: "Analytics-Tag", value: "Repay" },
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
      tokenAddress,
      REPAY_CONFIG,
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
    throw new Error("Error in repay function: " + error);
  }
}
