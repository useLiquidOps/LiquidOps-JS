import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { aoUtils } from "../..";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface Repay {
  token: TokenInput;
  quantity: BigInt;
  borrowID: string;
}

export async function repay(
  aoUtils: aoUtils,
  { token, quantity, borrowID }: Repay,
): Promise<SendMessageRes> {
  try {
    const { tokenAddress, oTokenAddress } = tokenInput(token);

    return await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Quantity: JSON.stringify(quantity),
      Recipient: oTokenAddress,
      "X-Action": "Repay",
      "Borrow-Id": borrowID,
      "borrowed-quantity": JSON.stringify(quantity),
      "borrowed-address": tokenAddress,
    });
  } catch (error) {
    throw new Error("Error in repay function:" + error);
  }
}
