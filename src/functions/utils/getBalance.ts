import { Token } from "ao-tokens";

export interface GetBalance {
  tokenAddress: string;
  walletAddress: string;
}

export async function getBalance({
  tokenAddress,
  walletAddress,
}: GetBalance): Promise<number> {
  try {
    const token = await Token(tokenAddress);
    const balance = await token.getBalance(walletAddress);
    return Number(balance.raw.toString());
  } catch (error) {
    console.log(error);
    throw new Error("Error getting balance");
  }
}
