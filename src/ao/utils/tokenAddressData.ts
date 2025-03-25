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

export const controllerAddress = "SmmMv0rJwfIDVM3RvY2-P729JFYwhdGSeGo2deynbfY";
export const redstoneOracleAddress =
  "R5rRjBFS90qIGaohtzd1IoyPwZD0qJZ25QXkP7_p5a0";
export const APRAgentAddress = "D3AlSUAtbWKcozsrvckRuCY6TVkAY1rWtLYGoGf6KIA";

export const tokenData: Record<string, TokenData> = {
  QAR: {
    name: "Quantum Arweave",
    icon: "8VLMb0c9NATl4iczfwpMDe1Eh8kFWIUpSlIkcGfDFzM",
    ticker: "QAR",
    address: "NG-0lVX882MG5nhARrSzyprEK6ejonHpdUmaaMPsHE8",
    oTicker: "oQAR",
    oAddress: "fODpFVOb5weX9Yc-26AA82m2MhmT7N9L0TkynOsruK0",
    controllerAddress,
    cleanTicker: "qAR",
    denomination: BigInt(12),
    collateralEnabled: true,
  },
  USDC: {
    name: "Wrapped USD Circle",
    icon: "iNYk0bDqUiH0eLT2rbYjYAI5i126R4ye8iAZb55IaIM",
    ticker: "WUSDC",
    address: "7zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ",
    oTicker: "oWUSDC",
    oAddress: "4MW7uLFtttSLWM-yWEqV9TGD6fSIDrqa4lbTgYL2qHg",
    controllerAddress,
    cleanTicker: "wUSDC",
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
