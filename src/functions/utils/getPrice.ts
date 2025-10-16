import { TokenInput } from "../../ao/utils/tokenInput";
import { convertTicker } from "../../ao/utils/tokenAddressData";
import { redstoneOracleAddress } from "../../ao/utils/tokenAddressData";
import { Services } from "../../ao/utils/connect";
import Patching from "./patching";

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

  const patching = new Patching(config?.HB_NODE_URL);
  const prices = await patching.now(
    redstoneOracleAddress,
    "/price",
    { json: true }
  );

  return prices[convertTicker(token)] || 0;
}
