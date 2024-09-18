import { sendMessage } from "../ao/sendMessage";
// @ts-ignore
import { Token } from "ao-tokens";

export async function unLend(
  poolID: string,
  quantity: number,
  poolTokenID: string,
) {
  try {
    // // TODO: fix POOL ID token balance issue
    // const token = await Token(poolID);
    // const amountToSend = token.Quantity.fromNumber(quantity);

    return await sendMessage(
      poolID,
      {
        Target: poolID,
        Action: "Burn",
        // Quantity: amountToSend.raw.toString(),
        Quantity: JSON.stringify(quantity * 1000000000000),
      },
      "",
      "Un-Lend",
      poolTokenID,
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in unLend message");
  }
}
