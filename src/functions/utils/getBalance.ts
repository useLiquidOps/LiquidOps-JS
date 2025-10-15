import { Token, Quantity } from "ao-tokens";
import Patching from "./patching";
import { Services } from "../../ao/utils/connect";

export interface GetBalance {
  tokenAddress: string;
  walletAddress: string;
}

export type GetBalanceRes = Quantity;

export async function getBalance({
  tokenAddress,
  walletAddress,
}: GetBalance, config?: Services): Promise<GetBalanceRes> {
  if (!tokenAddress || !walletAddress) {
    throw new Error("Please specify a tokenAddress and walletAddress.");
  }

  const patching = new Patching(config?.HB_NODE_URL);
  const [rawBalance, tokenInfo] = await Promise.all([
    patching.now(
      tokenAddress,
      `/balances/${walletAddress}`
    ),
    patching.compute(
      tokenAddress,
      "/token-info",
      { json: true }
    )
  ]);

  return new Quantity(rawBalance, BigInt(tokenInfo.denomination));
}
