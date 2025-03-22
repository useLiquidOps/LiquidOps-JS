import * as aoTokens from "ao-tokens";

export interface GetBalance {
  tokenAddress: string;
  walletAddress: string;
}

export async function getBalance({
  tokenAddress,
  walletAddress,
}: GetBalance): Promise<aoTokens.Quantity> {
  if (!tokenAddress || !walletAddress) {
    throw new Error("Please specify a tokenAddress and walletAddress.");
  }

  try {
    const tokenInstance = await aoTokens.Token(tokenAddress);
    const balance = await tokenInstance.getBalance(walletAddress);
    return new aoTokens.Quantity(balance.raw, tokenInstance.info.Denomination);
  } catch (error) {
    throw new Error("Error getting balance: " + error);
  }
}
