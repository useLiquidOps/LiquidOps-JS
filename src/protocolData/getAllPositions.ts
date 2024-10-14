import { sendMessage } from "../ao/sendMessage";
import { aoUtils } from "..";
import { oTokens, SupportedTokens } from "../ao/processData";

export interface GetAllPositions {
  token: SupportedTokens;
}

export interface GetAllPositionsRes {
  // TODO
}

export async function getAllPositions(
  aoUtils: aoUtils,
  { token }: GetAllPositions,
): Promise<GetAllPositionsRes> {
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

    throw new Error("Error getting all positions");
  }
}
