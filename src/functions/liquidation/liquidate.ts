import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import {
  TransactionResult,
  validateTransaction,
  findTransactionIds,
} from "../../ao/messaging/validationUtils";

const LIQUIDATE_CONFIG = {
  action: "Liquidate",
  expectedTxCount: 2,
  confirmationTag: "Liquidate-Confirmation",
  requiredNotices: ["Debit-Notice", "Credit-Notice"],
  requiresCreditDebit: true,
};

export interface Liquidate {
  token: TokenInput;
  rewardToken: TokenInput;
  targetUserAddress: string;
  quantity: BigInt;
}

export interface LiquidateRes extends TransactionResult {}

export async function liquidate(
  aoUtils: AoUtils,
  { token, rewardToken, targetUserAddress, quantity }: Liquidate,
): Promise<LiquidateRes> {
  try {
    if (!token || !rewardToken || !targetUserAddress || !quantity) {
      throw new Error(
        "Please specify token, reward token, target address, and quantity.",
      );
    }

    const { tokenAddress: repayTokenAddress, controllerAddress } =
      tokenInput(token);
    const { tokenAddress: rewardTokenAddress } = tokenInput(rewardToken);

    const transferID = await aoUtils.message({
      process: repayTokenAddress,
      tags: [
        { name: "Action", value: "Transfer" },
        { name: "Quantity", value: quantity.toString() },
        { name: "Recipient", value: controllerAddress },
        { name: "X-Target", value: targetUserAddress },
        { name: "X-Reward-Token", value: rewardTokenAddress },
        { name: "Protocol-Name", value: "LiquidOps" },
      ],
      signer: aoUtils.signer,
    });

    const transferResult = await validateTransaction(
      aoUtils,
      transferID,
      repayTokenAddress,
      LIQUIDATE_CONFIG,
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
      repayTokenAddress,
    );

    return {
      status: true,
      ...transactionIds,
      transferID,
    };
  } catch (error) {
    throw new Error("Error in liquidate function: " + error);
  }
}
