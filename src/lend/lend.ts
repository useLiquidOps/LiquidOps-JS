import { sendMessage } from "../ao/sendMessage";
import { Token } from "ao-tokens";
import { aoUtils } from "..";

export interface Lend {
  poolID: string,
  poolTokenID: string,
  quantity: number,
}

export async function lend(
  aoUtils: aoUtils,
  {poolID, poolTokenID, quantity}: Lend
) {
  try {
    const token = await Token(poolTokenID);
    const amountToSend = token.Quantity.fromNumber(quantity);

    return await sendMessage(aoUtils,
      poolTokenID,
      {
        Target: poolTokenID,
        Action: "Transfer",
        Quantity: amountToSend.raw.toString(),
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
