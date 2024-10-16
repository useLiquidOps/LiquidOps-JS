import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetPosition {
  token: TokenInput;
  recipient?: string;
}

export interface GetPositionRes {
  Capacity: string;
  "Used-Capacity": string;
  "Collateral-Ticker": string;
}

export async function getPosition(
  aoUtils: AoUtils,
  { token, recipient }: GetPosition,
): Promise<GetPositionRes> {
  try {

    if (!token || !recipient) {
      throw new Error("Please specify a token and recipient.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Position",
      ...(recipient && { Recipient: recipient }),
    });

    return res.Output; // TODO, make modular sendMessage response handling 
  } catch (error) {
    throw new Error("Error in getPosition function: " + error);
  }
}
