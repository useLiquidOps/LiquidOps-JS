import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface GetBalances {
  poolID: string;
}

export interface GetBalancesRes {
  // TODO
}

export async function getBalances(
  aoUtils: aoUtils,
  { poolID }: GetBalances,
): Promise<GetBalancesRes> {
  try {
    const message = await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Balances",
      },
      "",
      "Balances",
      poolID,
    );
    const res = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Balances",
    );
    return res.value;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting balances");
  }
}
