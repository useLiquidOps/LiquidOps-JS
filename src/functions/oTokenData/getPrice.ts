import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetPrice {
  token: TokenInput;
  quantity: BigInt;
}

export async function getPrice(
  aoUtils: aoUtils,
  { token, quantity }: GetPrice,
): Promise<number> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Price",
      Quantity: JSON.stringify(quantity),
    });
    const price = message.Messages[0].Tags.find(
      (token: any) => token.name === "price",
    );
    return price.value / 100;
  } catch (error) {
    throw new Error("Error in getPrice function:" + error);
  }
}
