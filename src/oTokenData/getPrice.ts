import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, SupportedTokens } from "../ao/processData";

export interface GetPrice {
  token: SupportedTokens;
  quantity: BigInt;
}

export async function getPrice(
  aoUtils: aoUtils,
  { token, quantity }: GetPrice,
): Promise<number> {
  try {
    const oTokenID = oTokens[token];

    const message = await sendMessage(
      aoUtils,
      oTokenID,
      {
        Target: oTokenID,
        Action: "Get-Price",
        Quantity: JSON.stringify(quantity),
      },
      "",
      "Get-Price",
      oTokenID,
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
