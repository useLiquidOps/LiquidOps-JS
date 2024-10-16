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

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Info",
    });

    const tags = message.Messages[0].Tags;
    const info: Partial<GetInfoRes> = {};

    tags.forEach((tag: { name: string; value: string }) => {
      switch (tag.name) {
        case "Name":
        case "Ticker":
        case "Logo":
        case "Denomination":
          info[tag.name] = tag.value;
          break;
      }
    });

    return info as GetInfoRes;
  } catch (error) {
    throw new Error("Error in getInfo function: " + error);
  }
}
