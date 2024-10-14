import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, SupportedTokens } from "../ao/processData";

export interface GetBalances {
  token: SupportedTokens;
}

export interface GetBalancesRes {
  // TODO
}

export async function getBalances(
  aoUtils: aoUtils,
  { token }: GetBalances,
): Promise<GetBalancesRes> {
  try {
    const oTokenID = oTokens[token];

    const message = await sendMessage(
      aoUtils,
      oTokenID,
      {
        Target: oTokenID,
        Action: "Balances",
      },
      "",
      "Balances",
      oTokenID,
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
