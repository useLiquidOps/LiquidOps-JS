import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface PayInterest {
  token: TokenInput;
  quantity: BigInt;
  borrowID: string;
}

export async function payInterest(
  aoUtils: aoUtils,
  { token, quantity, borrowID }: PayInterest,
): Promise<SendMessageRes> {
  try {
    const { tokenAddress, oTokenAddress } = tokenInput(token);

    return await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Quantity: JSON.stringify(quantity),
      Recipient: oTokenAddress,
      "X-Action": "Pay-Interest",
      "Borrow-Id": borrowID,
    });
  } catch (error) {
    throw new Error("Error in payInterest function:" + error);
  }
}
