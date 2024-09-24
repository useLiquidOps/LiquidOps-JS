import { Token } from "ao-tokens";
import { aoUtils } from "..";

export interface GetBalance {
  tokenAddress: string;
}

export async function getBalance(
  aoUtils: aoUtils,
  { tokenAddress }: GetBalance,
): Promise<number> {
  try {
    const walletAddress = aoUtils.signer.id; // TODO - get wallet address from signer
    const token = await Token(tokenAddress);
    const balance = await token.getBalance(walletAddress);
    return Number(balance.raw.toString());
  } catch (error) {
    return 0; // TODO: fix protocol balance issue when pool ID deployed
  }
}
