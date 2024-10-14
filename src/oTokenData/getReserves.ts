import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, SupportedTokens } from "../ao/processData";

export interface GetReserves {
  token: SupportedTokens;
}

export interface GetReservesRes {
  Target: string;
  Action: string;
  Available: number;
  Lent: number;
}

export async function getReserves(
  aoUtils: aoUtils,
  { token }: GetReserves,
): Promise<GetReservesRes> {
  try {
    const oTokenID = oTokens[token];

    const message = await sendMessage(
      aoUtils,
      oTokenID,
      {
        Target: oTokenID,
        Action: "Get-Reserve",
      },
      "Get-Reserve",
      oTokenID,
    );
    const res = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Reserves",
    );
    return res.value;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting reserves");
  }
}
