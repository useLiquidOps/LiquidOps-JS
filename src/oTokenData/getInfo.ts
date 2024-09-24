import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface GetInfo {
  poolID: string;
}

export interface GetInfoRes {
  Name: string;
  Ticker: string;
  Logo: string;
  Denomination: string;
}

export async function getInfo(
  aoUtils: aoUtils,
  { poolID }: GetInfo,
): Promise<GetInfoRes> {
  try {
    const message = await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Info",
      },
      "",
      "Info",
      poolID,
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
