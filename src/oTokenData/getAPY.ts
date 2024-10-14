import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, SupportedTokens } from "../ao/processData";

export interface GetAPY {
  token: SupportedTokens;
}

export async function getAPY(
  aoUtils: aoUtils,
  { token }: GetAPY,
): Promise<number> {
  try {
    const oTokenID = oTokens[token];

    const message = await sendMessage(
      aoUtils,
      oTokenID,
      {
        Target: oTokenID,
        Action: "Get-APY",
      },
      "Get-APY",
    );
    const APY = message?.Messages[0].Tags.find(
      (token: any) => token.name === "APY",
    );
    return APY.value / 100;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting pool APY");
  }
}
