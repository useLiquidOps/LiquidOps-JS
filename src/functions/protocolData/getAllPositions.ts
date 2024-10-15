import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetAllPositions {
  token: TokenInput;
}

export interface GetAllPositionsRes {
  // TODO
}

export async function getAllPositions(
  aoUtils: aoUtils,
  { token }: GetAllPositions,
): Promise<GetAllPositionsRes> {
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
    throw new Error("Error in getAllPositions function:" + error);
  }
}
