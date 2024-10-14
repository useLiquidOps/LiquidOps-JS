import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, SupportedTokens } from "../ao/processData";

export interface GetInfo {
  token: SupportedTokens;
}

export interface GetInfoRes {
  Name: string;
  Ticker: string;
  Logo: string;
  Denomination: string;
}

export async function getInfo(
  aoUtils: aoUtils,
  { token }: GetInfo,
): Promise<GetInfoRes> {
  const oTokenID = oTokens[token];

  try {
    const message = await sendMessage(
      aoUtils,
      oTokenID,
      {
        Target: oTokenID,
        Action: "Info",
      },
    );
    const info = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Info",
    );
    return info.value;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting info");
  }
}
