import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetPrice {
  token: TokenInput;
  quantity?: BigInt;
}

export async function getPrice(
  aoUtils: AoUtils,
  { token, quantity }: GetPrice,
): Promise<BigInt> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { oTokenAddress } = tokenInput(token);

    const message = await getData(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Price",
      ...(quantity && { Quantity: quantity.toString() }),
    });

    const priceTag = message.Messages[0].Tags.find(
      (tag: { name: string; value: string }) => tag.name === "Price",
    );

    return BigInt(priceTag.value);
  } catch (error) {
    throw new Error("Error in getPrice function: " + error);
  }
}
