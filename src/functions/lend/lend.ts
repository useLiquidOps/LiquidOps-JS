import {
  sendTransaction,
  SendTransactionRes,
} from "../../ao/messaging/sendTransaction";
import { AoUtils } from "../../ao/utils/connect";
import { tokenInput, TokenInput } from "../../ao/utils/tokenInput";

export interface Lend {
  token: TokenInput;
  quantity: BigInt;
}

export interface LendRes extends SendTransactionRes {}

export async function lend(
  aoUtils: AoUtils,
  { token, quantity }: Lend,
): Promise<LendRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { tokenAddress, oTokenAddress } = tokenInput(token);

    const res = await sendTransaction(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Quantity: quantity.toString(),
      Recipient: oTokenAddress,
      "X-Action": "Mint",
    });

    return res;
  } catch (error) {
    throw new Error("Error in lend function:" + error);
  }
}
