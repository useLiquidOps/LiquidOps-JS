import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetAllPositions {
  token: TokenInput;
}

export interface GetAllPositionsRes {
  Capacity: string;
  "Used-Capacity": string;
  "Collateral-Ticker": string;
}

export async function getAllPositions( // TODO: waiting on Marton
  aoUtils: AoUtils,
  { token }: GetAllPositions,
): Promise<GetAllPositionsRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-All-Positions",
    });

    return res.Output; // TODO, make modular sendMessage response handling
  } catch (error) {
    throw new Error("Error in getAllPositions function: " + error);
  }
}
