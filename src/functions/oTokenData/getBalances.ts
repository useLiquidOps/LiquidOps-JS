import { getData } from "../../ao/messaging/getData";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetBalances {
  token: TokenInput;
}

export type GetBalancesRes = Record<string, bigint>;

export async function getBalances({
  token,
}: GetBalances): Promise<GetBalancesRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await getData({
      Target: oTokenAddress,
      Action: "Balances",
    });

    if (!res.Messages || !res.Messages[0] || !res.Messages[0].Data) {
      throw new Error("Invalid response format from getData");
    }

    const balances = JSON.parse(res.Messages[0].Data);

    const result: GetBalancesRes = {};

    for (const key in balances) {
      if (Object.prototype.hasOwnProperty.call(balances, key)) {
        result[key] = BigInt(balances[key]);
      }
    }

    return result;
  } catch (error) {
    throw new Error(`Error in getBalances function: ${error}`);
  }
}
