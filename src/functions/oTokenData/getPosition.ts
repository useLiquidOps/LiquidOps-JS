import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../..";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetPosition {
  token: TokenInput;
}

export interface GetPositionRes {
  // TODO
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
    const res = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Get-Position",
    );
    return res.value;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting position");
  }
}
