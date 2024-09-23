import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface GetLiquidity {
  poolID: string;
}

export async function getLiquidity(aoUtils: aoUtils, { poolID }: GetLiquidity) {
  try {
    const message = await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Get-Reserve",
      },
      "",
      "Get-Reserve",
      poolID,
    );
    const totalLiquidity = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Total",
    );
    return totalLiquidity.value;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting pool liquidity");
  }
}
