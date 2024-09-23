import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface GetAPY {
  poolID: string;
}

export async function getAPY(aoUtils: aoUtils, { poolID }: GetAPY): Promise<number> {
  try {
    const message = await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Get-APY",
      },
      "",
      "Get-APY",
      poolID,
    );
    const APY = message?.Messages[0].Tags.find(
      (token: any) => token.name === "APY",
    );
    return APY.value / 100;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting pool APY");
  }
}
