import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { aoUtils } from "../..";
import { oTokens, tokens, SupportedTokens } from "../../ao/processData";

export interface PayInterest {
  token: SupportedTokens;
  quantity: BigInt;
  borrowID: string; // TODO: talk to Marton
}

export async function payInterest(
  aoUtils: aoUtils,
  { token, quantity, borrowID }: PayInterest,
): Promise<SendMessageRes> {
  try {
    const tokenID = tokens[token];
    const oTokenID = oTokens[token];

    return await sendMessage(aoUtils, {
      Target: tokenID,
      Action: "Transfer",
      Quantity: JSON.stringify(quantity),
      Recipient: oTokenID,
      "X-Action": "Pay-Interest",
      "Borrow-Id": borrowID,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error in payInterest message");
  }
}
