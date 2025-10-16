import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import Patching from "../utils/patching";

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
    const patching = new Patching(config?.HB_NODE_URL);

    const allPositions = await patching.now(
      oTokenAddress,
      "/positions",
      { json: true }
    );

    const transformedPositions: GetAllPositionsRes = {};

    for (const walletAddress in allPositions) {
      const originalPosition = allPositions[walletAddress];

      transformedPositions[walletAddress] = {
        borrowBalance: BigInt(originalPosition.borrowBalance),
        capacity: BigInt(originalPosition.capacity),
        collateralization: BigInt(originalPosition.collateralization),
        liquidationLimit: BigInt(originalPosition.liquidationLimit),
      };
    }

    return transformedPositions;
  } catch (error) {
    throw new Error(`Error in getAllPositions function: ${error}`);
  }
}
