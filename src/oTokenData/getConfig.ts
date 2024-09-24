import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface GetConfig {
  poolID: string;
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
  { poolID }: GetConfig,
): Promise<GetConfigRes> {
  try {
    const message = await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Get-Config",
      },
      "",
      "Get-Config",
      poolID,
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
