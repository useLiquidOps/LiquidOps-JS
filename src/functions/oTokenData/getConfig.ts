import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetConfig {
  token: TokenInput;
}

export interface GetConfigRes {
  Action: "Config";
  Token: string;
  "Collateral-Ratio": number;
  "Liquidation-Threshold": number;
  Oracle: string;
  "Collateral-Denomination": string;
}

export async function getConfig(
  aoUtils: AoUtils,
  { token }: GetConfig,
): Promise<GetConfigRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Config",
    });

    return res.Output; // TODO, make modular sendMessage response handling
  } catch (error) {
    throw new Error("Error in getConfig function: " + error);
  }
}
