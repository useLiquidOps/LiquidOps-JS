export interface TokenData {
  ticker: string;
  address: string;
  oTicker: string;
  oAddress: string;
}

const tokenData: Record<string, TokenData> = {
  wAR: {
    ticker: "wAR",
    address: "g9AjGn30ldiGvUSMUGADFIT1twzF3rEJxwPVPhrl8eE",
    oTicker: "owAR",
    oAddress: "0UWVo81RdMjeE08aZBfXoHAs1MQ-AX-A2RfGmOoNFKk",
  },
};

export type SupportedTokensTickers = keyof typeof tokenData;
export type SupportedTokensAddresses = TokenData["address"];
export type SupportedOTokensTickers = TokenData["oTicker"];
export type SupportedOTokensAddresses = TokenData["oAddress"];

export const tokens: Record<SupportedTokensTickers, SupportedTokensAddresses> =
  Object.fromEntries(
    Object.entries(tokenData).map(([ticker, data]) => [ticker, data.address]),
  );

export const oTokens: Record<
  SupportedOTokensTickers,
  SupportedOTokensAddresses
> = Object.fromEntries(
  Object.entries(tokenData).map(([_, data]) => [data.oTicker, data.oAddress]),
);
