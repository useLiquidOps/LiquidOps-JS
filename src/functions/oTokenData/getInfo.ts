import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
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
  aoUtils: aoUtils,
  { token }: GetInfo,
): Promise<GetInfoRes> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Info",
    });
    const info = message.Messages[0].Tags.find(
      (tag: { name: string; value: string }) => tag.name === "Info",
    );
    return info.value;
  } catch (error) {
    throw new Error("Error in getInfo function:" + error);
  }
}
