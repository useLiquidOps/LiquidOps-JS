import { sendMessage } from "../ao/sendMessage";
// @ts-ignore
import { Token } from "ao-tokens";
import { getPrice } from "../poolData/getPrice";

export async function borrow(
  poolID: string,
  poolTokenID: string,
  quantity: number
) {
  try {
    const USDPrice = await getPrice(poolTokenID);
    const USDworth = quantity * USDPrice;
    const twoTimesCollateral = 0.452386338;
    const token = await Token("ycQaQxjRf5IDg26kNJBlwfPjzZqLob_wJDVBu3DYxVw");
    const amountToSend = token.Quantity.fromNumber(twoTimesCollateral);

    // TODO: delete later
    // @ts-ignore
    const ticker = tokenInfo.find((tag) => tag.address === poolTokenID);

    return await sendMessage(
      "ycQaQxjRf5IDg26kNJBlwfPjzZqLob_wJDVBu3DYxVw",
      {
        Target: "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
        Action: "Transfer",
        Quantity: amountToSend.raw.toString(),
        Recipient: poolID,
        "X-Action": "Borrow",
        "borrowed-quantity": JSON.stringify(quantity),
        "borrowed-address": ticker?.name,
      },
      "",
      "Borrow",
      "ycQaQxjRf5IDg26kNJBlwfPjzZqLob_wJDVBu3DYxVw"
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in borrow message");
  }
}
