import { AoUtils, connectToAO } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import {
  TransactionResult,
  validateTransaction,
  findTransactionIds,
} from "../../ao/messaging/validationUtils";
import { WithResultOption } from "../utils/getResult";

const LIQUIDATE_CONFIG = {
  action: "Liquidate",
  expectedTxCount: 2,
  confirmationTag: "Liquidate-Confirmation",
  requiredNotices: ["Debit-Notice", "Credit-Notice"],
  requiresCreditDebit: true,
};

export type Liquidate = WithResultOption<{
  token: TokenInput;
  rewardToken: TokenInput;
  targetUserAddress: string;
  quantity: BigInt;
  minExpectedQuantity: BigInt;
}>;

export interface LiquidateRes extends TransactionResult {}

export async function liquidate<T extends Liquidate>(
  aoUtilsInput: Pick<AoUtils, "signer" | "configs">,
  {
    token,
    rewardToken,
    targetUserAddress,
    quantity,
    minExpectedQuantity,
    noResult = false,
  }: T,
): Promise<T["noResult"] extends true ? string : LiquidateRes> {
  try {
    if (
      !token ||
      !rewardToken ||
      !targetUserAddress ||
      !quantity ||
      !minExpectedQuantity
    ) {
      throw new Error(
        "Please specify token, reward token, target address, quantity and minExpectedQuantity.",
      );
    }

    const { spawn, message, result } = await connectToAO(aoUtilsInput.configs);

    const aoUtils: AoUtils = {
      spawn,
      message,
      result,
      signer: aoUtilsInput.signer,
      configs: aoUtilsInput.configs,
    };

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
        { name: "X-Action", value: "Liquidate" },
        ...((minExpectedQuantity && [
          {
            name: "X-Min-Expected-Quantity",
            value: minExpectedQuantity.toString(),
          },
        ]) ||
          []),
        { name: "Protocol-Name", value: "LiquidOps" },
      ],
      signer: aoUtils.signer,
    });

    if (noResult) {
      return transferID as any;
    }

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
      } as any;
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
    } as any;
  } catch (error) {
    throw new Error("Error in liquidate function: " + error);
  }
}
