import { sendMessage } from "../ao/sendMessage";
import { Token } from "ao-tokens";
import { aoUtils } from "..";

export interface PayInterest {
  poolID: string;
  poolTokenID: string;
  quantity: number;
  borrowID: string;
}

export async function payInterest(
  aoUtils: aoUtils,
  { poolID, poolTokenID, quantity, borrowID }: PayInterest,
) {
  try {
    const token = await Token("42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k");
    const amountToSend = token.Quantity.fromNumber(quantity);

    return await sendMessage(
      aoUtils,
      poolTokenID,
      {
        Target: poolTokenID,
        Action: "Transfer",
        Quantity: amountToSend.raw.toString(),
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
