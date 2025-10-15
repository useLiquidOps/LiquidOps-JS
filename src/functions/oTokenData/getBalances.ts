import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import Patching from "../utils/patching";

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

    const patching = new Patching(config?.HB_NODE_URL);
    const balances = await patching.compute(
      oTokenAddress,
      "/balances",
      { json: true }
    );

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
