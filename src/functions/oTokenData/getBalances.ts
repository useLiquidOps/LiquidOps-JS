import { getData } from "../../ao/messaging/getData";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetBalances {
  token: TokenInput;
}

export interface GetBalancesRes {
  [address: string]: BigInt;
}

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

    const balance: { [key: string]: string } = JSON.parse(res.Messages[0].Data);

    const key = Object.keys(balance)[0];
    const value = Object.values(balance)[0];

    if (!key || !value) {
      throw new Error("Invalid balance data format");
    }

    return { [key]: BigInt(value) };
  } catch (error) {
    throw new Error(`Error in getBalances function: ${error}`);
  }
}
