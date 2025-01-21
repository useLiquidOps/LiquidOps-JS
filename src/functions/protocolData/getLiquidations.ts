import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import { getAllPositions } from "./getAllPositions";

export interface GetLiquidations {
  token: TokenInput;
}

export interface GetLiquidationsRes {
  capacity: BigInt; // TODO: find res
  usedCapacity: BigInt; // TODO: find res
}

export async function getLiquidations(
  aoUtils: AoUtils,
  { token }: GetLiquidations,
): Promise<GetLiquidationsRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { controllerAddress } = tokenInput(token);

    const res = await getData(aoUtils, {
      Target: controllerAddress,
      Action: "Get-Auctions",
    });

    const availableLiquidations = JSON.parse(res.Messages[0].Data);
    const data = Object.values(availableLiquidations)[0] as {
      Capacity: string; // TODO: find res
      "Used-Capacity": string; // TODO: find res
    };

    // match positions to available liquidations to find available collateral to be liquidated

    const allPositions = await getAllPositions(aoUtils, {
        token
    })

    console.log(allPositions)

    return {
      capacity: BigInt(data.Capacity), // TODO: find res
      usedCapacity: BigInt(data["Used-Capacity"]), // TODO: find res
    };
  } catch (error) {
    throw new Error(`Error in getLiquidations function: ${error}`);
  }
}
