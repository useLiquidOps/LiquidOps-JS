import {
  SupportedTokensTickers,
  SupportedTokensAddresses,
  SupportedOTokensTickers,
  SupportedOTokensAddresses,
  tokens,
  oTokens,
} from "./tokenAddressData";

export type TokenInput = SupportedTokensTickers | SupportedTokensAddresses;

export interface TokenInfo {
  tokenAddress: SupportedTokensAddresses;
  oTokenAddress: SupportedOTokensAddresses;
}

export function tokenInput(token: TokenInput): TokenInfo {
  const tokenEntry = Object.entries(tokens).find(
    ([ticker, address]) => ticker === token || address === token,
  );

  if (tokenEntry) {
    const [ticker, tokenAddress] = tokenEntry;
    return {
      tokenAddress,
      oTokenAddress: oTokens[`o${ticker}` as SupportedOTokensTickers],
    };
  }

  if (
    Object.values(oTokens).some((address) => address === token) ||
    Object.keys(oTokens).includes(token as string)
  ) {
    throw new Error("Token input cannot be an oToken ticker or address.");
  }

  throw new Error("Token input is not supported.");
}
