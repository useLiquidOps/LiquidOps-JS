import { sendMessage } from "../ao/sendMessage";
// @ts-ignore
import { Token } from "ao-tokens";

export async function lend(
  poolID: string,
  poolTokenID: string,
  quantity: number,
) {
  try {
    const token = await Token(poolTokenID);
    const amountToSend = token.Quantity.fromNumber(quantity);

    return await sendMessage(
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
