import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, SupportedTokens } from "../ao/processData";

export interface GetConfig {
  token: SupportedTokens;
}

export interface GetConfigRes {
  Action: string;
  Token: string;
  "Collateral-Ratio": number;
  "Liquidation-Threshold": number;
  Oracle: string;
  "Wrapped-Denomination": string;
}

export async function getConfig(
  aoUtils: aoUtils,
  { token }: GetConfig,
): Promise<GetConfigRes> {
  try {
    const oTokenID = oTokens[token];

    const message = await sendMessage(
      aoUtils,
      oTokenID,
      {
        Target: oTokenID,
        Action: "Get-Config",
      },
      "Get-Config",
      oTokenID,
    );
    const res = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Get-Config",
    );
    return res.value;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting config");
  }
}
