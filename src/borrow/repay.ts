import { sendMessage, SendMessageRes } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface Repay {
  poolID: string;
  poolTokenID: string;
  quantity: BigInt;
  borrowID: string;
}

export async function repay(
  aoUtils: aoUtils,
  { poolID, poolTokenID, quantity, borrowID }: Repay,
): Promise<SendMessageRes> {
  try {

    return await sendMessage(
      aoUtils,
      "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
      {
        Target: "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
        Action: "Transfer",
        Quantity: JSON.stringify(quantity),
        Recipient: poolID,
        "X-Action": "Repay",
        "Borrow-Id": borrowID,
        "borrowed-quantity": JSON.stringify(quantity),
        "borrowed-address": poolTokenID,
      },
      "",
      "Repay",
      "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in repay message");
  }
}
