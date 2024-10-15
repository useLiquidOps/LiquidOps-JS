import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { aoUtils } from "../..";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface UnLend {
  token: TokenInput;
  quantity: BigInt;
}

export async function unLend(
  aoUtils: aoUtils,
  { token, quantity }: UnLend,
): Promise<SendMessageRes> {
  try {
    const { oTokenAddress } = tokenInput(token);

    return await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Burn",
      Quantity: JSON.stringify(quantity),
    });
  } catch (error) {
    throw new Error("Error in unLend function:" + error);
  }
}
