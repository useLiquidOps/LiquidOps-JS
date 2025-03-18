import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetAllPositions {
  token: TokenInput;
}

export interface GetAllPositionsRes {
  capacity: BigInt;
  borrowBalance: BigInt;
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

    const res = await getData({
      Target: oTokenAddress,
      Action: "Positions",
    });

    const positions = JSON.parse(res.Messages[0].Data);
    const data = Object.values(positions)[0] as {
      Capacity: string;
      "Borrow-Balance": string;
    };

    return {
      capacity: BigInt(data.Capacity),
      borrowBalance: BigInt(data["Borrow-Balance"]),
    };
  } catch (error) {
    throw new Error(`Error in getAllPositions function: ${error}`);
  }
}
