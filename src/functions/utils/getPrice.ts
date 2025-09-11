import { TokenInput } from "../../ao/utils/tokenInput";
import { getData } from "../../ao/messaging/getData";
import {
  controllerAddress,
  convertTicker,
} from "../../ao/utils/tokenAddressData";
import { redstoneOracleAddress } from "../../ao/utils/tokenAddressData";
import { RedstonePrices } from "../liquidations/getLiquidations";
import { Services } from "../../ao/utils/connect";

export interface GetPrice {
  token: TokenInput | string;
}

export type GetPriceRes = number;

export async function getPrice(
  { token }: GetPrice,
  config?: Services,
): Promise<GetPriceRes> {
  if (!token) {
    throw new Error("Please specify a token.");
  }

  try {
    const redstonePriceFeedRes = await getData(
      {
        Owner: controllerAddress,
        Target: redstoneOracleAddress,
        Action: "v2.Request-Latest-Data",
        Tickers: JSON.stringify([convertTicker(token)]),
      },
      config,
    );

    const prices: RedstonePrices = JSON.parse(
      redstonePriceFeedRes.Messages[0].Data,
    );

    return prices[convertTicker(token)].v;
  } catch (error) {
    throw new Error("Error getting price: " + error);
  }
}
