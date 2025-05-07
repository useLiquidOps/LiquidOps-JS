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
  baseDenomination: bigint;
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
    baseDenomination: BigInt(12),
  },
  WAR: {
    name: "Wrapped Arweave",
    icon: "ICMLzIKdVMedibwgOy014I4yan_F8h2ZhORhRG5dgzs",
    ticker: "WAR",
    address: "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10",
    oTicker: "oWAR",
    oAddress: "rAc0aP0g9NXYUXAbvlLjPH_XxyQy6eYmwSuIcf6ukuw",
    controllerAddress,
    cleanTicker: "wAR",
    denomination: BigInt(12),
    collateralEnabled: true,
    baseDenomination: BigInt(12),
  },
  WUSDC: {
    name: "Wrapped USD Circle",
    icon: "iNYk0bDqUiH0eLT2rbYjYAI5i126R4ye8iAZb55IaIM",
    ticker: "WUSDC",
    address: "7zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ",
    oTicker: "oWUSDC",
    oAddress: "4MW7uLFtttSLWM-yWEqV9TGD6fSIDrqa4lbTgYL2qHg",
    controllerAddress,
    cleanTicker: "wUSDC",
    denomination: BigInt(6),
    collateralEnabled: true,
    baseDenomination: BigInt(6),
  },
  WUSDT: {
    name: "Wrapped USD Tether",
    icon: "JaxupVYerLRZWLd32llz_3CG8sCQaNhn2hAWm51U_7s",
    ticker: "WUSDT",
    address: "7j3jUyFpTuepg_uu_sJnwLE6KiTVuA9cLrkfOp2MFlo",
    oTicker: "oWUSDT",
    oAddress: "9B9J1O5FDoMsFZGJUSOa6TwivsH7LYIfiaizPn7fUHs",
    controllerAddress,
    cleanTicker: "wUSDT",
    denomination: BigInt(18),
    collateralEnabled: true,
    baseDenomination: BigInt(18),
  },
};

export function convertTicker(ticker: string): string {
  if (ticker === "QAR") return "AR";
  if (ticker === "WUSDC") return "USDC";
  if (ticker === "WAR") return "AR";
  if (ticker === "WUSDT") return "USDT";
  return ticker;
}

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
