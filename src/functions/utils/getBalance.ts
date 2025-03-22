import { Token } from "ao-tokens";
import { Quantity } from "ao-tokens";

export interface GetBalance {
  tokenAddress: string;
  walletAddress: string;
}

export async function getBalance({
  tokenAddress,
  walletAddress,
}: GetBalance): Promise<Quantity> {
  if (!tokenAddress || !walletAddress) {
    throw new Error("Please specify a tokenAddress and walletAddress.");
  }

  try {
    const tokenInstance = await Token(tokenAddress);
    const balance = await tokenInstance.getBalance(walletAddress);
    return new Quantity(balance.raw, tokenInstance.info.Denomination);
  } catch (error) {
    throw new Error("Error getting balance: " + error);
  }
}
