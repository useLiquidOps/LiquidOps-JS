export interface TokenData {
  name: string;
  icon: string;
  ticker: string;
  address: string;
  oTicker: string;
  oAddress: string;
  controllerAddress: string;
  cleanTicker: string;
  denomination: bigint;
  collateralEnabled: boolean;
}

export const controllerAddress = "vYlv6Dx8ZGt4oGaqsXaPjh9qi8iS8eQsoU9Ai65km4A";
export const redstoneOracleAddress =
  "5ndbRn7nQiAiQdiPc7AlY2idJGsakQotTRQr1f1UFj8";
export const APRAgentAddress = "D3AlSUAtbWKcozsrvckRuCY6TVkAY1rWtLYGoGf6KIA";

export const tokenData: Record<string, TokenData> = {
  QAR: {
    name: "Quantum Arweave",
    icon: "8VLMb0c9NATl4iczfwpMDe1Eh8kFWIUpSlIkcGfDFzM",
    ticker: "QAR",
    address: "rjYl6i4cDpE4c-OIJ7srTrcNulrf8Xw4Y8pDZDBAOUs",
    oTicker: "oQAR",
    oAddress: "G_nw_FqdNv-tz8cQmd8vJZkjMs42HBJjY7HzyVfh51U",
    controllerAddress,
    cleanTicker: "qAR",
    denomination: BigInt(12),
    collateralEnabled: true,
  },
  USDC: {
    name: "USD Circle",
    icon: "iNYk0bDqUiH0eLT2rbYjYAI5i126R4ye8iAZb55IaIM",
    ticker: "USDC",
    address: "zFEDdM1uAW1n3dwgzLUTO0GGFbCMdEXfDQjNc3Gbong",
    oTicker: "oUSDC",
    oAddress: "_mqEcN6LtjkpI4cgw2JZ30WOgmwO83uIZ5ivXg5uWz0",
    controllerAddress,
    cleanTicker: "USDC",
    denomination: BigInt(12),
    collateralEnabled: true,
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

export const collateralEnabledTickers = Object.keys(tokenData).filter(
  (ticker) => tokenData[ticker as SupportedTokensTickers].collateralEnabled,
);
export const collateralEnabledOTickers = collateralEnabledTickers.map(
  (ticker) => tokenData[ticker as SupportedTokensTickers].oTicker,
);
