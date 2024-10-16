import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetConfig {
  token: TokenInput;
}

export interface GetConfigRes {
  Action: string;
  Token: string;
  "Collateral-Ratio": string;
  "Liquidation-Threshold": string;
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

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Config",
    });

    const tags = message.Messages[0].Tags;
    const config: Partial<GetConfigRes> = {};

    tags.forEach((tag: { name: string; value: string }) => {
      switch (tag.name) {
        case "Action":
        case "Token":
        case "Collateral-Ratio":
        case "Liquidation-Threshold":
        case "Oracle":
        case "Collateral-Denomination":
          config[tag.name] = tag.value;
          break;
      }
    });

    if (Object.keys(config).length !== 6) {
      throw new Error("Incomplete configuration data in the response");
    }

    return config as GetConfigRes;
  } catch (error) {
    throw new Error("Error in getConfig function: " + error);
  }
}
