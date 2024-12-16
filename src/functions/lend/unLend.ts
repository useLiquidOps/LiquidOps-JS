import {
  sendTransaction,
  SendTransactionRes,
} from "../../ao/messaging/sendTransaction";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface UnLend {
  token: TokenInput;
  quantity: BigInt;
}

export interface UnLendRes extends SendTransactionRes {}

export async function unLend(
  aoUtils: AoUtils,
  { token, quantity }: UnLend,
): Promise<UnLendRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await sendTransaction(aoUtils, {
      Target: oTokenAddress,
      Action: "Redeem",
      Quantity: quantity.toString(),
    });

    return res;
  } catch (error) {
    throw new Error("Error in unLend function:" + error);
  }
}
