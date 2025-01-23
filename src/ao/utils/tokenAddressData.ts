export interface TokenData {
  ticker: string;
  address: string;
  oTicker: string;
  oAddress: string;
  controllerAddress: string;
}

const controllerAddress = "vYlv6Dx8ZGt4oGaqsXaPjh9qi8iS8eQsoU9Ai65km4A";

export const tokenData: Record<string, TokenData> = {
  QAR: {
    ticker: "QAR",
    address: "XJYGT9ZrVdzQ5d7FzptIsKrJtEF4jWPbgC91bXuBAwU",
    oTicker: "oQAR",
    oAddress: "qwprjR3EbRQBeCO70swm6cEKgFL8PvLX7ZRbm7BTLAA",
    controllerAddress,
  },
  STETH: {
    ticker: "STETH",
    address: "GUJI7zjPoJ0uAHIBWiYrKL2bpwfltTZFXNL4J-IV8AI",
    oTicker: "oSTETH",
    oAddress: "AkztgkChEE-evw-2cXhZ5M-XtKdQ7QFsHbU0QSGVLbU",
    controllerAddress,
  },
  USDC: {
    ticker: "USDC",
    address: "EoGGnxiSIUr0C5aZhTA_c8WipuASleomMrvyvuJCKvM",
    oTicker: "oUSDC",
    oAddress: "b5O1gc70knHdRA6JkDXI95FdmL3EGROWPDn9f8du3RU",
    controllerAddress,
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
