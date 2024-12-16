export interface TokenData {
  ticker: string;
  address: string;
  oTicker: string;
  oAddress: string;
}

const tokenData: Record<string, TokenData> = {
  QAR: {
    ticker: "QAR",
    address: "3addpL9j4OdWBKbvGucFtg5BoZycBNwlA8vy3h9VZhE",
    oTicker: "oQAR",
    oAddress: "KNpCAntte9l1_AZm7Yn5AGmN-j8C_UURCxcxCb0oiOA",
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
