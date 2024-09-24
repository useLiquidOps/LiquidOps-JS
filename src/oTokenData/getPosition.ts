import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface GetPosition {
  poolID: string;
}

export interface GetPositionRes {
  // TODO
}

export async function getPosition(
  aoUtils: aoUtils,
  { poolID }: GetPosition,
): Promise<GetPositionRes> {
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

    throw new Error("Error getting position");
  }
}
