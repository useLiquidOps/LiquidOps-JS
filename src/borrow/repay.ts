import { sendMessage, SendMessageRes } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, tokens, SupportedTokens } from "../ao/processData";

export interface Repay {
  token: SupportedTokens;
  quantity: BigInt;
  borrowID: string;
}

export async function repay(
  aoUtils: aoUtils,
  { token, quantity, borrowID }: Repay,
): Promise<SendMessageRes> {
  try {
    const tokenID = tokens[token];
    const oTokenID = oTokens[token];

    return await sendMessage(
      aoUtils,
      tokenID,
      {
        Target: tokenID,
        Action: "Transfer",
        Quantity: JSON.stringify(quantity),
        Recipient: oTokenID,
        "X-Action": "Repay",
        "Borrow-Id": borrowID,
        "borrowed-quantity": JSON.stringify(quantity),
        "borrowed-address": tokenID,
      },
      "Repay",
      tokenID,
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in repay message");
  }
}
