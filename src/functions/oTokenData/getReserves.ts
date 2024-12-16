import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetReserves {
  token: TokenInput;
}

export interface GetReservesRes {
  available: string;
  lent: string;
}

interface Tag {
  name: string;
  value: string;
}

export async function getReserves(
  aoUtils: AoUtils,
  { token }: GetReserves,
): Promise<GetReservesRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await getData(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Reserves",
    });

    const tagsObject = Object.fromEntries(
      res.Messages[0].Tags.map((tag: Tag) => [tag.name, tag.value]),
    );

    return {
      available: tagsObject["Available"],
      lent: tagsObject["Lent"],
    };
  } catch (error) {
    throw new Error("Error in getReserves function: " + error);
  }
}
