import { getData } from "../../ao/messaging/getData";
import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetAllPositions {
  token: TokenInput;
}

export interface GetAllPositionsRes {
  [walletAddress: string]: {
    borrowBalance: BigInt;
    capacity: BigInt;
    collateralization: BigInt;
    liquidationLimit: BigInt;
  };
}

export async function getAllPositions(
  { token }: GetAllPositions,
  config?: Services,
): Promise<GetAllPositionsRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await getData(
      {
        Target: oTokenAddress,
        Action: "Positions",
      },
      config,
    );

    const allPositions = JSON.parse(res.Messages[0].Data);

    const transformedPositions: GetAllPositionsRes = {};

    for (const walletAddress in allPositions) {
      const originalPosition = allPositions[walletAddress];

      transformedPositions[walletAddress] = {
        borrowBalance: BigInt(originalPosition["Borrow-Balance"]),
        capacity: BigInt(originalPosition.Capacity),
        collateralization: BigInt(originalPosition["Collateralization"]),
        liquidationLimit: BigInt(originalPosition["Liquidation-Limit"]),
      };
    }

    return transformedPositions;
  } catch (error) {
    throw new Error(`Error in getAllPositions function: ${error}`);
  }
}
