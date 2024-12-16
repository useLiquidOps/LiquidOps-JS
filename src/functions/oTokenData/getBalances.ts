import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetBalances {
  token: TokenInput;
}

export interface GetBalancesRes {
  [address: string]: BigInt;
}

export async function getBalances(
  aoUtils: AoUtils,
  { token }: GetBalances,
): Promise<GetBalancesRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await getData(aoUtils, {
      Target: oTokenAddress,
      Action: "Balances",
    });

    console.log(res.Messages[0]);

    // @ts-ignore TODO
    return res;
  } catch (error) {
    throw new Error("Error in getBalances function: " + error);
  }
}
