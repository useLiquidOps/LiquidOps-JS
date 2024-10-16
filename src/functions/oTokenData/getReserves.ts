import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetReserves {
  token: TokenInput;
}

export interface GetReservesRes {
  Action: string;
  Available: BigInt;
  Lent: BigInt;
}

export async function getReserves(
  aoUtils: AoUtils,
  { token }: GetReserves,
): Promise<GetReservesRes> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Reserves",
    });

    const tags = message.Messages[0].Tags;
    const reserves: Partial<GetReservesRes> = { Action: "Reserves" };

    tags.forEach((tag: { name: string; value: string }) => {
      switch (tag.name) {
        case "Available":
        case "Lent":
          reserves[tag.name] = BigInt(tag.value);
          break;
      }
    });

    if (Object.keys(reserves).length !== 3) {
      throw new Error("Incomplete reserves information in the response");
    }

    return reserves as GetReservesRes;
  } catch (error) {
    throw new Error("Error in getReserves function: " + error);
  }
}
