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
  kinkParam: string;
  jumpRate: string;
  baseRate: string;
  utilization: string;
  initRate: string;
  oracleDelayTolerance: string;
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
      res.Messages[0].Tags.map((tag: Tag) => [
        (tag.name[0].toLowerCase() + tag.name.slice(1)).replace(/-/g, ""),
        tag.value,
      ]),
    );

    return tagsObject as GetInfoRes;
  } catch (error) {
    throw new Error("Error in getInfo function: " + error);
  }
}
