import { sendMessage, SendMessageRes } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface Borrow {
  poolID: string;
  poolTokenID: string;
  quantity: BigInt;
}

export async function borrow(
  aoUtils: aoUtils,
  { poolID, poolTokenID, quantity }: Borrow,
): Promise<SendMessageRes> {
  try {

    return await sendMessage(
      aoUtils,
      "ycQaQxjRf5IDg26kNJBlwfPjzZqLob_wJDVBu3DYxVw",
      {
        Target: "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
        Action: "Transfer",
        Quantity: JSON.stringify(quantity),
        Recipient: poolID,
        "X-Action": "Borrow",
        "borrowed-quantity": JSON.stringify(quantity),
        "borrowed-address": poolTokenID,
      },
      "",
      "Borrow",
      "ycQaQxjRf5IDg26kNJBlwfPjzZqLob_wJDVBu3DYxVw",
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in borrow message");
  }
}
