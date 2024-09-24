import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";

export interface GetPrice {
  poolID: string;
  quantity: number;
}

export async function getPrice(
  aoUtils: aoUtils,
  { poolID, quantity }: GetPrice,
): Promise<number> {
  try {
    const message = await sendMessage(
      aoUtils,
      poolID,
      {
        Target: poolID,
        Action: "Get-Price",
        Quantity: quantity
      },
      "",
      "Get-Price",
      poolID,
    );
    const price = message?.Messages[0].Tags.find(
      (token: any) => token.name === "price",
    );
    return price.value / 100;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting price");
  }
}
