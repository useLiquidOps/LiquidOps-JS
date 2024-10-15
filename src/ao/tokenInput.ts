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
  // Check if the input is a token ticker
  if (token in tokens) {
    return {
      tokenAddress: tokens[token as SupportedTokensTickers],
      oTokenAddress: oTokens[`o${token}` as SupportedOTokensTickers],
    };
  }
  // Check if the input is a token address
  else if (Object.values(tokens).includes(token as SupportedTokensAddresses)) {
    const tokenAddress = token as SupportedTokensAddresses;
    const tickerEntry = Object.entries(tokens).find(
      ([_, address]) => address === token,
    );
    if (tickerEntry) {
      return {
        tokenAddress,
        oTokenAddress: oTokens[`o${tickerEntry[0]}` as SupportedOTokensTickers],
      };
    }
    throw new Error("Unable to find corresponding oToken address.");
  }
  // Check if the input is an oToken ticker or address
  else if (
    token in oTokens ||
    Object.values(oTokens).includes(token as SupportedOTokensAddresses)
  ) {
    throw new Error("Token input cannot be an oToken ticker or address.");
  } else {
    throw new Error("Token input is not supported.");
  }
}
