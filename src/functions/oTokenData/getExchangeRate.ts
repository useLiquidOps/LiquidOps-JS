import { getData } from "../../ao/messaging/getData";
import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetExchangeRate {
  token: TokenInput;
  quantity: BigInt;
}

export type GetExchangeRateRes = BigInt;

export async function getExchangeRate(
  { token, quantity }: GetExchangeRate,
  config?: Services,
): Promise<GetExchangeRateRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { oTokenAddress } = tokenInput(token);

    const message = await getData(
      {
        Target: oTokenAddress,
        Action: "Exchange-Rate-Current",
        ...(quantity && { Quantity: quantity.toString() }),
      },
      config,
    );

    const valueTag = message.Messages[0].Tags.find(
      (tag: { name: string; value: string }) => tag.name === "Value",
    );

    return BigInt(valueTag.value);
  } catch (error) {
    throw new Error("Error in getExchangeRate function: " + error);
  }
}
