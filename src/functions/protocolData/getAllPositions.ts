import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetAllPositions {
  token: TokenInput;
}

export interface GetAllPositionsRes {
  capacity: BigInt;
  usedCapacity: BigInt;
}

export async function getAllPositions(
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
      Action: "Positions",
    });

    const positions = JSON.parse(res.Messages[0].Data);
    const data = Object.values(positions)[0] as {
      Capacity: string;
      "Used-Capacity": string;
    };

    return {
      capacity: BigInt(data.Capacity),
      usedCapacity: BigInt(data["Used-Capacity"]),
    };
  } catch (error) {
    throw new Error(`Error in getAllPositions function: ${error}`);
  }
}
