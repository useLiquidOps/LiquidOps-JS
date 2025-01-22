import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetPosition {
  token: TokenInput;
  recipient?: string;
}

export interface GetPositionRes {
  capacity: string;
  usedCapacity: string;
  collateralTicker: string;
  collateralDenomination: string;
  totalCollateral: string;
}

interface Tag {
  name: string;
  value: string;
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

    const res = await getData({
      Target: oTokenAddress,
      Action: "Position",
      ...(recipient && { Recipient: recipient }),
    });

    const tagsObject = Object.fromEntries(
      res.Messages[0].Tags.map((tag: Tag) => [tag.name, tag.value]),
    );

    return {
      capacity: tagsObject["Capacity"],
      usedCapacity: tagsObject["Used-Capacity"],
      collateralTicker: tagsObject["Collateral-Ticker"],
      collateralDenomination: tagsObject["Collateral-Denomination"],
      totalCollateral: tagsObject["Total-Collateral"],
    };
  } catch (error) {
    throw new Error("Error in getPosition function: " + error);
  }
}
