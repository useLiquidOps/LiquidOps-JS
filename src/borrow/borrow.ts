import { sendMessage, SendMessageRes } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, tokens, SupportedTokens } from "../ao/processData";

export interface Borrow {
  token: SupportedTokens;
  quantity: BigInt;
}

export async function borrow(
  aoUtils: aoUtils,
  { token, quantity }: Borrow,
): Promise<SendMessageRes> {
  try {
    const tokenID = tokens[token];
    const oTokenID = oTokens[token];

    return await sendMessage(aoUtils, {
      Target: tokenID,
      Action: "Transfer",
      Quantity: JSON.stringify(quantity),
      Recipient: oTokenID,
      "X-Action": "Borrow",
      "borrowed-quantity": JSON.stringify(quantity),
      "borrowed-address": tokenID,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error in borrow message");
  }
}
