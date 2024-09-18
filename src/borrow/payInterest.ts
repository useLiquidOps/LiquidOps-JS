import { sendMessage } from "../ao/sendMessage";
// @ts-ignore
import { Token } from "ao-tokens";
import { getPrice } from "../processData/getPrice";

export async function payInterest(
  poolID: string,
  poolTokenID: string,
  quantity: number,
  borrowID: string,
) {
  try {
    const USDPrice = await getPrice(poolTokenID);
    const USDworth = quantity * USDPrice;
    const token = await Token("42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k");
    const amountToSend = token.Quantity.fromNumber(USDworth);

    return await sendMessage(
      poolTokenID,
      {
        Target: poolTokenID,
        Action: "Transfer",
        Quantity: amountToSend.raw.toString(),
        Recipient: poolID,
        "X-Action": "Pay-Interest",
        "Borrow-Id": borrowID,
      },
      "",
      "Pay-Interest",
      poolTokenID,
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in payInterest message");
  }
}
