import { sendMessage, SendMessageRes } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface UnLend {
  poolID: string;
  poolTokenID: string;
  quantity: BigInt;
}

export async function unLend(
  aoUtils: aoUtils,
  { poolID, poolTokenID, quantity }: UnLend,
): Promise<SendMessageRes> {
  try {

    return await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Burn",
        Quantity: JSON.stringify(quantity),
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
