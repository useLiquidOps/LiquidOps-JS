import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface GetReserves {
  poolID: string;
}

export interface GetReservesRes {
  Target: string;
  Action: string;
  Available: number;
  Lent: number;
}

export async function getReserves(
  aoUtils: aoUtils,
  { poolID }: GetReserves
): Promise<GetReservesRes> {
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
      poolID
    );
    const res = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Reserves"
    );
    return res.value;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting reserves");
  }
}
