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
  deprecated: boolean;
  oIcon: string;
  borrowingDisabled: boolean;
  borrowingDisabledReason: "" | "Deprecated token." | "AO airdrop.";
}

export const controllerAddress = "SmmMv0rJwfIDVM3RvY2-P729JFYwhdGSeGo2deynbfY";
export const redstoneOracleAddress =
  "R5rRjBFS90qIGaohtzd1IoyPwZD0qJZ25QXkP7_p5a0";
export const APRAgentAddress = "D3AlSUAtbWKcozsrvckRuCY6TVkAY1rWtLYGoGf6KIA";
export const lqdTokenAddress = "n2MhPK0O3yEvY2zW73sqcmWqDktJxAifJDrri4qireI";

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
    deprecated: true,
    oIcon: "i_U-jhdMMaib2hK51qPrKXbLo6cx2Nt58_gNz5FA4sw",
    borrowingDisabled: true,
    borrowingDisabledReason: "Deprecated token.",
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
    deprecated: false,
    oIcon: "lTWBOBtEZ2JvTAHfvoPq5aXRWTVouv7jZ-6B9HTwosU",
    borrowingDisabled: true,
    borrowingDisabledReason: "AO airdrop.",
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
    deprecated: false,
    oIcon: "7EEISJIzxC-3RPhgvRc-lAZnP7st1b79_ER4Sc5P_MU",
    borrowingDisabled: false,
    borrowingDisabledReason: "",
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
    deprecated: false,
    oIcon: "bkAnKOF4NhqPHnccDhPyOzBws42zNE-u9WtxCPdaABU",
    borrowingDisabled: false,
    borrowingDisabledReason: "",
  },
  WETH: {
    name: "Wrapped Ethereum",
    icon: "Bi7iqzLQXN-wVD3nM8TYGfTI9g7HgGtiD0XuruoQTJk",
    ticker: "WETH",
    address: "cBgS-V_yGhOe9P1wCIuNSgDA_JS8l4sE5iFcPTr0TD0",
    oTicker: "oWETH",
    oAddress: "rNa0hdxEZjz_TAUoI85OcPRul_BzoS6Py_3vamJKpr4",
    controllerAddress,
    cleanTicker: "wETH",
    denomination: BigInt(18),
    collateralEnabled: true,
    baseDenomination: BigInt(18),
    deprecated: false,
    oIcon: "z1nnBgzGpt-eXHrjD5A9KrQX6dK8E1ONDuBIqB94VTA",
    borrowingDisabled: false,
    borrowingDisabledReason: "",
  },
  USDA: {
    name: "Astro USD",
    icon: "seXozJrsP0OgI0gvAnr8zmfxiHHb5iSlI9wMI8SdamE",
    ticker: "USDA",
    address: "FBt9A5GA_KXMMSxA2DJ0xZbAq8sLLU2ak-YJe9zDvg8",
    oTicker: "oUSDA",
    oAddress: "qX9KiT3p_KnV5RE7Dddghwc0uC5t-kvsVgjq2iLAi8s",
    controllerAddress,
    cleanTicker: "USDA",
    denomination: BigInt(12),
    collateralEnabled: false,
    baseDenomination: BigInt(12),
    deprecated: false,
    oIcon: "p7iMD3X6iGYQ5Qw7dPU4ER7w678wEt2epwSA8t6-hu8",
    borrowingDisabled: false,
    borrowingDisabledReason: "",
  },
  VAR: {
    name: "Vento Arweave",
    icon: "XQKXtuxDGDn13z0JBqYvbkNXPu3Y3aE1WaK2XftQ3cA",
    ticker: "VAR",
    address: "y-p7CPhs6JMUStAuE4KeTnMXN7qYBvEi2hiBFk8ZhjM",
    oTicker: "oVAR",
    oAddress: "", //
    controllerAddress,
    cleanTicker: "vAR",
    denomination: BigInt(12), //
    collateralEnabled: false,
    baseDenomination: BigInt(12), //
    deprecated: false,
    oIcon: "", //
    borrowingDisabled: false,
    borrowingDisabledReason: "",
  },
  VUSDC: {
    name: "Vento USD Circle",
    icon: "DbT_EMed2vx4MR7N03YJYLSNeNBvuSgIzjybw8TOqMg",
    ticker: "VUSDC",
    address: "cxkFiGP89fEKOvbvl9SLs1lEaw0L-DWJiqQOuDPeDG8",
    oTicker: "oVUSDC",
    oAddress: "", //
    controllerAddress,
    cleanTicker: "vUSDC",
    denomination: BigInt(12), //
    collateralEnabled: false,
    baseDenomination: BigInt(12), //
    deprecated: false,
    oIcon: "", //
    borrowingDisabled: false,
    borrowingDisabledReason: "",
  },
};

export function convertTicker(ticker: string): string {
  ticker = ticker.toUpperCase();
  if (ticker === "QAR") return "AR";
  if (ticker === "WUSDC") return "USDC";
  if (ticker === "WAR") return "AR";
  if (ticker === "WUSDT") return "USDT";
  if (ticker === "WETH") return "ETH";
  if (ticker === "USDA") return "USDC";
  if (ticker === "VAR") return "AR";
  if (ticker === "VUSDC") return "USDC";
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
