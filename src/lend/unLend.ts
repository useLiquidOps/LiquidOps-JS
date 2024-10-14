import { sendMessage, SendMessageRes } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, tokens, SupportedTokens } from "../ao/processData";

export interface UnLend {
  token: SupportedTokens;
  quantity: BigInt;
}

export async function unLend(
  aoUtils: aoUtils,
  { token, quantity }: UnLend,
): Promise<SendMessageRes> {
  try {
    const tokenID = tokens[token];
    const oTokenID = oTokens[token];

    return await sendMessage(
      aoUtils,
      oTokenID,
      {
        Target: oTokenID,
        Action: "Burn",
        Quantity: JSON.stringify(quantity),
      },
      "Un-Lend",
      tokenID,
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in unLend message");
  }
}
