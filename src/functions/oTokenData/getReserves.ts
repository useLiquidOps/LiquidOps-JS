import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../..";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetReserves {
  token: TokenInput;
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
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Reserve",
    });
    const res = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Reserves",
    );
    return res.value;
  } catch (error) {
    throw new Error("Error in getReserves function:" + error);
  }
}
