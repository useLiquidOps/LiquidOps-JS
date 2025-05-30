import { tokenData } from "./tokenAddressData";

export function getBaseDenomination(ticker: string) {
  return tokenData[ticker].baseDenomination;
}
