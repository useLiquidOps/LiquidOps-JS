import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

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

    const res = await getData(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-All-Positions",
    });

    // @ts-ignore TODO
    return res;
  } catch (error) {
    throw new Error("Error in getAllPositions function: " + error);
  }
}
