import { Token } from "ao-tokens";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetBalance {
  token: TokenInput | string;
  walletAddress: string;
}

export async function getBalance({
  token,
  walletAddress,
}: GetBalance): Promise<BigInt> {
  try {
    let tokenAddress: string;

    try {
      const { tokenAddress: supportedTokenAddress } = tokenInput(
        token as TokenInput,
      );
      tokenAddress = supportedTokenAddress;
    } catch (error) {
      tokenAddress = token as string;
    }

    const tokenInstance = await Token(tokenAddress);
    const balance = await tokenInstance.getBalance(walletAddress);
    return BigInt(balance.raw.toString());
  } catch (error) {
    throw new Error("Error in getBalance function:" + error);
  }
}
