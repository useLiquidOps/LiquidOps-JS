import { sendMessage } from "../ao/sendMessage";
import { Token } from "ao-tokens";

export async function repay(
  poolID: string,
  poolTokenID: string,
  quantity: number,
  borrowID: string
) {
  try {
    const token = await Token("42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k");
    const amountToSend = token.Quantity.fromNumber(quantity);

    return await sendMessage(
      "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
      {
        Target: "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
        Action: "Transfer",
        Quantity: amountToSend.raw.toString(),
        Recipient: poolID,
        "X-Action": "Repay",
        "Borrow-Id": borrowID,
        "borrowed-quantity": JSON.stringify(quantity),
        "borrowed-address": poolTokenID,
      },
      "",
      "Repay",
      "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k"
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in repay message");
  }
}
