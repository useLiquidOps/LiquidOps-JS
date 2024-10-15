import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface Lend {
  token: TokenInput;
  quantity: BigInt;
}

export async function lend(
  aoUtils: aoUtils,
  { token, quantity }: Lend,
): Promise<SendMessageRes> {
  try {
    const { tokenAddress, oTokenAddress } = tokenInput(token);

    return await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Quantity: JSON.stringify(quantity),
      Recipient: oTokenAddress,
      "X-Action": "Lend",
    });
  } catch (error) {
    throw new Error("Error in lend function:" + error);
  }
}
