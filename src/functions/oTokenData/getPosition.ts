import { getData } from "../../ao/messaging/getData";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetPosition {
  token: TokenInput;
  recipient: string;
}

export interface GetPositionRes {
  capacity: string;
  borrowBalance: string;
  collateralTicker: string;
  collateralDenomination: string;
  collateralization: string;
  liquidationLimit: string;
}

interface Tag {
  name: string;
  value: string;
}

export async function getPosition({
  token,
  recipient,
}: GetPosition): Promise<GetPositionRes> {
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
      borrowBalance: tagsObject["Borrow-Balance"],
      collateralTicker:
        tagsObject["Collateral-Ticker"] === "AR"
          ? "qAR"
          : tagsObject["Collateral-Ticker"],
      collateralDenomination: tagsObject["Collateral-Denomination"],
      collateralization: tagsObject["Collateralization"],
      liquidationLimit: tagsObject["Liquidation-Limit"],
    };
  } catch (error) {
    throw new Error("Error in getPosition function: " + error);
  }
}
