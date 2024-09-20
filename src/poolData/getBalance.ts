// @ts-ignore
import { Token } from "ao-tokens";

export async function getBalance(walletAddress: string, tokenAddress: string) {
  try {
    // const token = await Token(tokenAddress);
    // const balance = await token.getBalance(walletAddress);
    // return Number(balance.raw.toString());
    return 250.4;
  } catch (error) {
    return 0; // TODO: fix protocol balance issue when pool ID deployed
  }
}
