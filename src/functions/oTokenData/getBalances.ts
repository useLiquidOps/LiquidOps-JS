import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

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

    const res = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Balances",
    });

    return res.Output; // TODO, make modular sendMessage response handling
  } catch (error) {
    throw new Error("Error in getBalances function: " + error);
  }
}
