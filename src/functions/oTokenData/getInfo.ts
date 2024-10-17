import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetInfo {
  token: TokenInput;
}

export interface GetInfoRes {
  Name: string;
  Ticker: string;
  Logo: string;
  Denomination: string;
}

export async function getInfo(
  aoUtils: AoUtils,
  { token }: GetInfo,
): Promise<GetInfoRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Info",
    });

    return res.Output; // TODO, make modular sendMessage response handling
  } catch (error) {
    throw new Error("Error in getInfo function: " + error);
  }
}
