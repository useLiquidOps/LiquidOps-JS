import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetPosition {
  token: TokenInput;
}

export interface GetPositionRes {
  Capacity: number;
  "Used-Capacity": number;
  "Collateral-Ticker": number;
}

export async function getPosition(
  aoUtils: aoUtils,
  { token }: GetPosition,
): Promise<GetPositionRes> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Get-Position",
    });
    const res = message.Messages[0].Tags.find(
      (tag: { name: string; value: string }) => tag.name === "Get-Position",
    );
    return res.value;
  } catch (error) {
    throw new Error("Error in getPosition function:" + error);
  }
}
