import { sendMessage, SendMessageRes } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface Lend {
  poolID: string;
  poolTokenID: string;
  quantity: BigInt;
}

export async function lend(
  aoUtils: aoUtils,
  { poolID, poolTokenID, quantity }: Lend,
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
        "X-Action": "Lend",
      },
      "",
      "Lend",
      poolTokenID,
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in lend message");
  }
}
