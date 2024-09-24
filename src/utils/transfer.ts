import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface Transfer {
  poolID: string
    recipient: string;
  quantity: number;
}

export interface TransferRes {
  // TODO
}

export async function transfer(
  aoUtils: aoUtils,
  { poolID, recipient, quantity }: Transfer,
): Promise<TransferRes> {
  try {
    const message = await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Transfer",
        Recipient: recipient,
        Quantity: quantity
      },
      "",
      "Transfer",
      poolID,
    );
    const res = message?.Messages[0]
    return res
  } catch (error) {
    console.log(error);

    throw new Error("Error transferring");
  }
}
