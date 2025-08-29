import { Token, Quantity } from "ao-tokens";
import { getInfo } from "../oTokenData/getInfo";

export interface GetBalance {
  tokenAddress: string;
  walletAddress: string;
}

export type GetBalanceRes = Quantity;

export async function getBalance({
  tokenAddress,
  walletAddress,
}: GetBalance): Promise<GetBalanceRes> {
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
