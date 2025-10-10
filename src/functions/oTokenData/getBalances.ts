import { getData } from "../../ao/messaging/getData";
import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetBalances {
  token: TokenInput;
}

export type GetBalancesRes = Record<string, bigint>;

export async function getBalances(
  { token }: GetBalances,
  config?: Services,
): Promise<GetBalancesRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const balances = await (
      await fetch(`${config?.HB_NODE_URL}/${oTokenAddress}~process@1.0/now/balances~json@1.0/serialize?bundle`)
    ).json();

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
