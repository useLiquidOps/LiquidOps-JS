export interface TokenData {
  ticker: string;
  address: string;
  oTicker: string;
  oAddress: string;
  controllerAddress: string;
}

export const tokenData: Record<string, TokenData> = {
  QAR: {
    ticker: "QAR",
    address: "3addpL9j4OdWBKbvGucFtg5BoZycBNwlA8vy3h9VZhE",
    oTicker: "oQAR",
    oAddress: "KNpCAntte9l1_AZm7Yn5AGmN-j8C_UURCxcxCb0oiOA",
    controllerAddress: "QDrMlGmiMnKNL4QiAvlhbzZ-AzZH8CFRELXfnufboLw", // TODO: wait for Marton to deploy
  },
  STETH: {
    ticker: "STETH",
    address: "3addpL9j4OdWBKbvGucFtg5BoZycBNwlA8vy3h9VZhE",
    oTicker: "oSTETH",
    oAddress: "KNpCAntte9l1_AZm7Yn5AGmN-j8C_UURCxcxCb0oiOA",
    controllerAddress: "QDrMlGmiMnKNL4QiAvlhbzZ-AzZH8CFRELXfnufboLw", // TODO: wait for Marton to deploy
  },
  DAI: {
    ticker: "DAI",
    address: "3addpL9j4OdWBKbvGucFtg5BoZycBNwlA8vy3h9VZhE",
    oTicker: "oDAI",
    oAddress: "KNpCAntte9l1_AZm7Yn5AGmN-j8C_UURCxcxCb0oiOA",
    controllerAddress: "QDrMlGmiMnKNL4QiAvlhbzZ-AzZH8CFRELXfnufboLw", // TODO: wait for Marton to deploy
  },
};

export type SupportedTokensTickers = keyof typeof tokenData;
export type SupportedTokensAddresses = TokenData["address"];
export type SupportedOTokensTickers = TokenData["oTicker"];
export type SupportedOTokensAddresses = TokenData["oAddress"];
export type SupportedControllerAddresses = TokenData["controllerAddress"];

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

export const controllers: Record<
  SupportedTokensTickers,
  SupportedControllerAddresses
> = Object.fromEntries(
  Object.entries(tokenData).map(([ticker, data]) => [
    ticker,
    data.controllerAddress,
  ]),
);
