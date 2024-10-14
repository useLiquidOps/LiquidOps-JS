import { sendMessage, SendMessageRes } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, tokens, SupportedTokens } from "../ao/processData";

export interface Lend {
  token: SupportedTokens;
  quantity: BigInt;
}

export async function lend(
  aoUtils: aoUtils,
  { token, quantity }: Lend,
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
        "X-Action": "Lend",
      },
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in lend message");
  }
}
