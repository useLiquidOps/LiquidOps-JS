import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import {
  TransactionResult,
  validateTransaction,
} from "../../ao/messaging/validationUtils";
import { WithResultOption } from "../utils/getResult";

export const UNLEND_CONFIG = {
  action: "Redeem",
  expectedTxCount: 1,
  confirmationTag: "Redeem-Confirmation",
  requiredNotices: ["Redeem-Confirmation"],
  requiresCreditDebit: false,
};

export type UnLend = WithResultOption<{
  token: TokenInput;
  quantity: BigInt;
}>;

export interface UnLendRes extends TransactionResult {}

export async function unLend<T extends UnLend>(
  aoUtils: AoUtils,
  { token, quantity, noResult = false }: T,
): Promise<T["noResult"] extends true ? string : UnLendRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { oTokenAddress, tokenAddress } = tokenInput(token);

    const transferID = await aoUtils.message({
      process: oTokenAddress,
      tags: [
        { name: "Action", value: "Redeem" },
        { name: "Quantity", value: quantity.toString() },
        { name: "Protocol-Name", value: "LiquidOps" },
        { name: "Analytics-Tag", value: "UnLend" },
        { name: "Analytics-Tag", value: "UnLend" },
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
      UNLEND_CONFIG,
    );

    if (transferResult === "pending") {
      return {
        status: "pending",
        transferID,
        response: "Transaction pending.",
      } as any;
    }

    return {
      status: true,
      transferID,
    } as any;
  } catch (error) {
    throw new Error("Error in unLend function: " + error);
  }
}
