// import { Token } from "ao-tokens";
// import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

// export interface GetBalance {
//   token: TokenInput | string;
//   walletAddress: string;
// }

// export async function getBalance({
//   token,
//   walletAddress,
// }: GetBalance): Promise<BigInt> {
//   try {
//     if (!token || !walletAddress) {
//       throw new Error("Please specify a token and walletAddress.");
//     }

//     const { tokenAddress } = tokenInput(token);

//     const tokenInstance = await Token(tokenAddress);
//     const balance = await tokenInstance.getBalance(walletAddress);
//     return balance.raw;
//   } catch (error) {
//     throw new Error("Error in getBalance function: " + error);
//   }
// }
