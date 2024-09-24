import { Token } from "ao-tokens";
import { aoUtils } from "..";

export interface GetBalance {
  tokenAddress: string;
  walletAddress: string;
}

export async function getBalance(
  aoUtils: aoUtils,
  { tokenAddress, walletAddress }: GetBalance,
): Promise<number> {
  try {
    const token = await Token(tokenAddress);
    const balance = await token.getBalance(walletAddress);
    return Number(balance.raw.toString());
  } catch (error) {
    return 0; // TODO: fix protocol balance issue when pool ID deployed
  }
}
