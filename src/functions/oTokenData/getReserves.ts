import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetReserves {
  token: TokenInput;
}

export interface GetReservesRes {
  Action: "Reserves";
  Available: string;
  Lent: string;
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

    const res = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Reserves",
    });

    return res.Output; // TODO, make modular sendMessage response handling 
  } catch (error) {
    throw new Error("Error in getReserves function: " + error);
  }
}
