import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetConfig {
  token: TokenInput;
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
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Config",
    });
    const res = message.Messages[0].Tags.find(
      (tag: { name: string; value: string }) => tag.name === "Get-Config",
    );
    return res.value;
  } catch (error) {
    throw new Error("Error in getConfig function:" + error);
  }
}
