import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface GetAllPositions {
  poolID: string;
}

export interface GetAllPositionsRes {
  // TODO
}

export async function getAllPositions(
  aoUtils: aoUtils,
  { poolID }: GetAllPositions,
): Promise<GetAllPositionsRes> {
  try {
    const message = await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Get-Position",
      },
      "",
      "Get-Position",
      poolID,
    );
    const res = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Get-Position",
    );
    return res.value;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting all positions");
  }
}
