import { sendMessage, SendMessageRes } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface PayInterest {
  poolID: string;
  poolTokenID: string;
  quantity: BigInt;
  borrowID: string;
}

export async function payInterest(
  aoUtils: aoUtils,
  { poolID, poolTokenID, quantity, borrowID }: PayInterest,
): Promise<SendMessageRes> {
  try {

    return await sendMessage(
      aoUtils,
      poolTokenID,
      {
        Target: poolTokenID,
        Action: "Transfer",
        Quantity: JSON.stringify(quantity),
        Recipient: poolID,
        "X-Action": "Pay-Interest",
        "Borrow-Id": borrowID,
      },
      "",
      "Pay-Interest",
      poolTokenID,
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in payInterest message");
  }
}
