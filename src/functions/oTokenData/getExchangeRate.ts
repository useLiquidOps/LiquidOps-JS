import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import Patching from "../utils/patching";

export interface GetExchangeRate {
  token: TokenInput;
  quantity: BigInt;
}

export type GetExchangeRateRes = BigInt;

export async function getExchangeRate(
  { token, quantity }: GetExchangeRate,
  config?: Services,
): Promise<GetExchangeRateRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { oTokenAddress } = tokenInput(token);
    const patching = new Patching(config?.HB_NODE_URL);

    const tokenInfo = await patching.now(
      oTokenAddress,
      "/token-info",
      { json: true }
    );

    const totalSupply = BigInt(tokenInfo.supply);
    if (totalSupply === BigInt(0)) return quantity;

    const poolState = await patching.now(
      oTokenAddress,
      "/pool-state",
      { json: true }
    );
    const totalPooled = BigInt(poolState.cash) + BigInt(poolState["total-borrows"]) - BigInt(poolState["total-reserves"]);

    return totalPooled * (quantity as bigint) / totalSupply;
  } catch (error) {
    throw new Error("Error in getExchangeRate function: " + error);
  }
}
