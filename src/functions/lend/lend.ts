import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import {
  TransactionResult,
  validateTransaction,
  findTransactionIds,
} from "../../ao/messaging/validationUtils";

const LEND_CONFIG = {
  action: "Mint",
  expectedTxCount: 2,
  confirmationTag: "Mint-Confirmation",
  requiredNotices: ["Debit-Notice", "Credit-Notice"],
  requiresCreditDebit: true,
};

export interface Lend {
  token: TokenInput;
  quantity: BigInt;
}

export interface LendRes extends TransactionResult {}

export async function lend(
  aoUtils: AoUtils,
  { token, quantity }: Lend,
): Promise<LendRes> {
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
        { name: "X-Action", value: "Mint" },
        { name: "Protocol-Name", value: "LiquidOps" },
        { name: "Analytics-Tag", value: "Lend" },
        { name: "timestamp", value: JSON.stringify(Date.now()) },
        { name: "token", value: tokenAddress },
      ],
      signer: aoUtils.signer,
    });

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
      };
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
    };
  } catch (error) {
    throw new Error("Error in lend function: " + error);
  }
}
