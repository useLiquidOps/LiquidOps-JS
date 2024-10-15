import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface Transfer {
  token: TokenInput | string;
  recipient: string;
  quantity: BigInt;
}

export interface TransferRes {
  // TODO
}

export async function transfer(
  aoUtils: aoUtils,
  { token, recipient, quantity }: Transfer,
): Promise<TransferRes> {
  try {
    let tokenAddress: string;

    try {
      const { tokenAddress: supportedTokenAddress } = tokenInput(
        token as TokenInput,
      );
      tokenAddress = supportedTokenAddress;
    } catch (error) {
      // If tokenInput fails, assume it's a custom address
      tokenAddress = token as string;
    }

    const message = await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Recipient: recipient,
      Quantity: JSON.stringify(quantity),
      "LO-Action": "Transfer",
    });
    const res = message.Messages[0];
    return res;
  } catch (error) {
    throw new Error("Error in transfer function:" + error);
  }
}
