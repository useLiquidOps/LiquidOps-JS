import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetAPY {
  token: TokenInput;
}

export async function getAPY(
  aoUtils: aoUtils,
  { token }: GetAPY,
): Promise<number> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-APY",
    });

    const APY = message.Messages[0].Tags.find(
      (tag: { name: string; value: string }) => tag.name === "APY",
    );

    if (!APY) {
      throw new Error("APY not found in the response");
    }

    return parseFloat(APY.value) / 100;
  } catch (error) {
    throw new Error("Error in getAPY function:" + error);
  }
}
