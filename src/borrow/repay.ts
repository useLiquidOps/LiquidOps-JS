import { sendMessage } from "../ao/sendMessage";
// @ts-ignore
import { Token } from "ao-tokens";
import { getPrice } from "../poolData/getPrice";

export async function repay(
  poolID: string,
  poolTokenID: string,
  quantity: number,
  borrowID: string
) {
  try {
    const USDPrice = await getPrice(poolTokenID);
    const USDworth = quantity * USDPrice;
    const twoTimesCollateral = USDworth * 2;
    const token = await Token("42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k");
    const amountToSend = token.Quantity.fromNumber(twoTimesCollateral);

    // TODO: delete later
    // @ts-ignore
    const ticker = tokenInfo.find((tag) => tag.address === poolTokenID);

    return await sendMessage(
      "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
      {
        Target: "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k",
        Action: "Transfer",
        Quantity: amountToSend.raw.toString(),
        Recipient: poolID,
        "X-Action": "Repay",
        "Borrow-Id": borrowID,
        "borrowed-quantity": JSON.stringify(quantity),
        "borrowed-address": ticker?.name,
      },
      "",
      "Repay",
      "42F7zlKZ53Ph9BCW8DJvxM7PMuqOwL-UsoxBqzAw46k"
    );
  } catch (error) {
    console.log(error);
    throw new Error("Error in repay message");
  }
}
