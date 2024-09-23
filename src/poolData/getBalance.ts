import { Token } from "ao-tokens";

export interface GetBalance {
  walletAddress: string;
  tokenAddress: string;
}

export async function getBalance({ walletAddress, tokenAddress }: GetBalance) {
  try {
    const token = await Token(tokenAddress);
    const balance = await token.getBalance(walletAddress);
    return Number(balance.raw.toString());
  } catch (error) {
    return 0; // TODO: fix protocol balance issue when pool ID deployed
  }
}
