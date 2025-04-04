import { getData } from "../../ao/messaging/getData";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetInfo {
  token: TokenInput;
}

export interface GetInfoRes {
  collateralDenomination: string;
  liquidationThreshold: string;
  totalSupply: string;
  totalBorrows: string;
  valueLimit: string;
  name: string;
  collateralFactor: string;
  totalReserves: string;
  cash: string;
  oracle: string;
  logo: string;
  reserveFactor: string;
  denomination: string;
  collateralId: string;
  ticker: string;
}

interface Tag {
  name: string;
  value: string;
}

export async function getInfo({ token }: GetInfo): Promise<GetInfoRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await getData({
      Target: oTokenAddress,
      Action: "Info",
    });

    const tagsObject = Object.fromEntries(
      res.Messages[0].Tags.map((tag: Tag) => [tag.name, tag.value]),
    );

    return {
      collateralDenomination: tagsObject["Collateral-Denomination"],
      liquidationThreshold: tagsObject["Liquidation-Threshold"],
      totalSupply: tagsObject["Total-Supply"],
      totalBorrows: tagsObject["Total-Borrows"],
      valueLimit: tagsObject["Value-Limit"],
      name: tagsObject["Name"],
      collateralFactor: tagsObject["Collateral-Factor"],
      totalReserves: tagsObject["Total-Reserves"],
      cash: tagsObject["Cash"],
      oracle: tagsObject["Oracle"],
      logo: tagsObject["Logo"],
      reserveFactor: tagsObject["Reserve-Factor"],
      denomination: tagsObject["Denomination"],
      collateralId: tagsObject["Collateral-Id"],
      ticker: tagsObject["Ticker"],
    };
  } catch (error) {
    throw new Error("Error in getInfo function: " + error);
  }
}
