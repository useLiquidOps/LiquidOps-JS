import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetInfo {
  token: TokenInput;
}

export interface GetInfoRes {
  name: string;
  ticker: string;
  logo: string;
  denomination: string;
}

interface Tag {
  name: string;
  value: string;
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

    const res = await getData({
      Target: oTokenAddress,
      Action: "Info",
    });

    const tagsObject = Object.fromEntries(
      res.Messages[0].Tags.map((tag: Tag) => [tag.name, tag.value]),
    );

    return {
      name: tagsObject["Name"],
      ticker: tagsObject["Ticker"],
      logo: tagsObject["Logo"],
      denomination: tagsObject["Denomination"],
    };
  } catch (error) {
    throw new Error("Error in getInfo function: " + error);
  }
}
