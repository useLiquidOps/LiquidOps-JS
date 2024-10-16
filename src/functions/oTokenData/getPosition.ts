import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetPosition {
  token: TokenInput;
  recipient?: string;
}

export interface GetPositionRes {
  Capacity: BigInt;
  "Used-Capacity": BigInt;
  "Collateral-Ticker": string;
}

export async function getPosition(
  aoUtils: AoUtils,
  { token, recipient }: GetPosition
): Promise<GetPositionRes> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Position",
      ...(recipient && { Recipient: recipient }),
    });

    const tags = message.Messages[0].Tags;
    const position: Partial<GetPositionRes> = {};

    tags.forEach((tag: { name: string; value: string }) => {
      switch (tag.name) {
        case "Capacity":
        case "Used-Capacity":
          position[tag.name] = BigInt(tag.value);
          break;
        case "Collateral-Ticker":
          position[tag.name] = tag.value;
          break;
      }
    });

    if (Object.keys(position).length !== 3) {
      throw new Error("Incomplete position information in the response");
    }

    return position as GetPositionRes;
  } catch (error) {
    throw new Error("Error in getPosition function: " + error);
  }
}
