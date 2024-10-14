import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface Transfer {
  tokenAddress: string;
  recipient: string;
  quantity: BigInt;
}

export interface TransferRes {
  // TODO
}

export async function transfer(
  aoUtils: aoUtils,
  { tokenAddress, recipient, quantity }: Transfer,
): Promise<TransferRes> {
  try {
    const message = await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Recipient: recipient,
      Quantity: JSON.stringify(quantity),
    });
    const res = message?.Messages[0];
    return res;
  } catch (error) {
    console.log(error);

    throw new Error("Error transferring");
  }
}
