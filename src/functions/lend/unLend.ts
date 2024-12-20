import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import {
  TransactionResult,
  validateTransaction,
} from "../../ao/messaging/validationUtils";

const UNLEND_CONFIG = {
  action: "Redeem",
  expectedTxCount: 1,
  confirmationTag: "Redeem-Confirmation",
  requiredNotices: ["Redeem-Confirmation"],
  requiresCreditDebit: false,
};

export interface UnLend {
  token: TokenInput;
  quantity: BigInt;
}

export interface UnLendRes extends TransactionResult {}

export async function unLend(
  aoUtils: AoUtils,
  { token, quantity }: UnLend,
): Promise<UnLendRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { oTokenAddress } = tokenInput(token);

    const transferID = await aoUtils.message({
      process: oTokenAddress,
      tags: [
        { name: "Action", value: "Redeem" },
        { name: "Quantity", value: quantity.toString() },
        { name: "Protocol-Name", value: "LiquidOps" },
      ],
      signer: aoUtils.signer,
    });

    const transferResult = await validateTransaction(
      aoUtils,
      transferID,
      oTokenAddress,
      UNLEND_CONFIG,
    );

    if (transferResult === "pending") {
      return {
        status: "pending",
        transferID,
        response: "Transaction pending.",
      };
    }

    return {
      status: true,
      transferID,
    };
  } catch (error) {
    throw new Error("Error in unLend function: " + error);
  }
}
