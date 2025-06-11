import { AoUtils, connectToAO } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import {
  TransactionResult,
  validateTransaction,
  findTransactionIds,
} from "../../ao/messaging/validationUtils";
import { WithResultOption } from "../utils/getResult";

export const LEND_CONFIG = {
  action: "Mint",
  expectedTxCount: 2,
  confirmationTag: "Mint-Confirmation",
  requiredNotices: ["Debit-Notice", "Credit-Notice"],
  requiresCreditDebit: true,
};

export type Lend = WithResultOption<{
  token: TokenInput;
  quantity: BigInt;
}>;

export interface LendRes extends TransactionResult {}

export async function lend<T extends Lend>(
  aoUtilsInput: Pick<AoUtils, "signer" | "configs">,
  { token, quantity, noResult = false }: T,
): Promise<T["noResult"] extends true ? string : LendRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { spawn, message, result } = await connectToAO(aoUtilsInput.configs);

    const aoUtils: AoUtils = {
      spawn,
      message,
      result,
      signer: aoUtilsInput.signer,
      configs: aoUtilsInput.configs,
    };

    const { tokenAddress, oTokenAddress } = tokenInput(token);

    const transferID = await aoUtils.message({
      process: tokenAddress,
      tags: [
        { name: "Action", value: "Transfer" },
        { name: "Quantity", value: quantity.toString() },
        { name: "Recipient", value: oTokenAddress },
        { name: "X-Action", value: "Mint" },
        { name: "Protocol-Name", value: "LiquidOps" },
        { name: "Analytics-Tag", value: "Lend" },
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
      LEND_CONFIG,
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
    throw new Error("Error in lend function: " + error);
  }
}
