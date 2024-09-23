import { sendMessage } from "../ao/sendMessage";
import { Token } from "ao-tokens";
import { aoUtils } from "..";

export interface UnLend {
  poolID: string;
  quantity: number;
  poolTokenID: string;
}

export async function unLend(
  aoUtils: aoUtils,
  { poolID, quantity, poolTokenID }: UnLend,
) {
  try {
    const token = await Token(poolID);
    const amountToSend = token.Quantity.fromNumber(quantity);

    return await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Burn",
        Quantity: amountToSend.raw.toString(),
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
