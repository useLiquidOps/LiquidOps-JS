import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, SupportedTokens } from "../ao/processData";

export interface GetPosition {
  token: SupportedTokens;
}

export interface GetPositionRes {
  // TODO
}

export async function getPosition(
  aoUtils: aoUtils,
  { token }: GetPosition,
): Promise<GetPositionRes> {
  try {
    const oTokenID = oTokens[token];

    const message = await sendMessage(
      aoUtils,
      oTokenID,
      {
        Target: oTokenID,
        Action: "Get-Position",
      },
      "Get-Position",
    );
    const res = message?.Messages[0].Tags.find(
      (token: any) => token.name === "Get-Position",
    );
    return res.value;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting position");
  }
}
