import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { aoUtils } from "../..";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface Borrow {
  token: TokenInput;
  quantity: BigInt;
}

export async function borrow(
  aoUtils: aoUtils,
  { token, quantity }: Borrow,
): Promise<SendMessageRes> {
  try {
    const { tokenAddress, oTokenAddress } = tokenInput(token);

    return await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Quantity: JSON.stringify(quantity),
      Recipient: oTokenAddress,
      "X-Action": "Borrow",
      "borrowed-quantity": JSON.stringify(quantity),
      "borrowed-address": tokenAddress,
    });
  } catch (error) {
    throw new Error("Error in borrow function:" + error);
  }
}
