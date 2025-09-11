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
    cleanTicker: "qAR",
    collateralEnabled: true,
    address: "NG-0lVX882MG5nhARrSzyprEK6ejonHpdUmaaMPsHE8",
    icon: "8VLMb0c9NATl4iczfwpMDe1Eh8kFWIUpSlIkcGfDFzM",
    denomination: BigInt(12),
    //
    oAddress: "fODpFVOb5weX9Yc-26AA82m2MhmT7N9L0TkynOsruK0",
    oIcon: "i_U-jhdMMaib2hK51qPrKXbLo6cx2Nt58_gNz5FA4sw",
    //
    deprecated: true,
    borrowingDisabled: true,
    borrowingDisabledReason: "Deprecated token.",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
  },
  WAR: {
    name: "Wrapped Arweave",
    cleanTicker: "wAR",
    collateralEnabled: true,
    address: "xU9zFkq3X2ZQ6olwNVvr1vUWIjc3kXTWr7xKQD6dh10",
    icon: "ICMLzIKdVMedibwgOy014I4yan_F8h2ZhORhRG5dgzs",
    denomination: BigInt(12),
    //
    oAddress: "rAc0aP0g9NXYUXAbvlLjPH_XxyQy6eYmwSuIcf6ukuw",
    oIcon: "lTWBOBtEZ2JvTAHfvoPq5aXRWTVouv7jZ-6B9HTwosU",
    //
    deprecated: false,
    borrowingDisabled: true,
    borrowingDisabledReason: "AO airdrop.",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
  },
  WUSDC: {
    name: "Wrapped USD Circle",
    cleanTicker: "wUSDC",
    collateralEnabled: true,
    address: "7zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ",
    icon: "iNYk0bDqUiH0eLT2rbYjYAI5i126R4ye8iAZb55IaIM",
    denomination: BigInt(6),
    //
    oAddress: "4MW7uLFtttSLWM-yWEqV9TGD6fSIDrqa4lbTgYL2qHg",
    oIcon: "7EEISJIzxC-3RPhgvRc-lAZnP7st1b79_ER4Sc5P_MU",
    //
    deprecated: false,
    borrowingDisabled: false,
    borrowingDisabledReason: "",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
  },
  WUSDT: {
    name: "Wrapped USD Tether",
    cleanTicker: "wUSDT",
    collateralEnabled: true,
    address: "7j3jUyFpTuepg_uu_sJnwLE6KiTVuA9cLrkfOp2MFlo",
    icon: "JaxupVYerLRZWLd32llz_3CG8sCQaNhn2hAWm51U_7s",
    denomination: BigInt(18),
    //
    oAddress: "9B9J1O5FDoMsFZGJUSOa6TwivsH7LYIfiaizPn7fUHs",
    oIcon: "bkAnKOF4NhqPHnccDhPyOzBws42zNE-u9WtxCPdaABU",
    //
    deprecated: false,
    borrowingDisabled: false,
    borrowingDisabledReason: "",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
  },
  WETH: {
    name: "Wrapped Ethereum",
    cleanTicker: "wETH",
    collateralEnabled: true,
    address: "cBgS-V_yGhOe9P1wCIuNSgDA_JS8l4sE5iFcPTr0TD0",
    icon: "Bi7iqzLQXN-wVD3nM8TYGfTI9g7HgGtiD0XuruoQTJk",
    denomination: BigInt(18),
    //
    oAddress: "rNa0hdxEZjz_TAUoI85OcPRul_BzoS6Py_3vamJKpr4",
    oIcon: "z1nnBgzGpt-eXHrjD5A9KrQX6dK8E1ONDuBIqB94VTA",
    //
    deprecated: false,
    borrowingDisabled: false,
    borrowingDisabledReason: "",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
  },
  USDA: {
    name: "Astro USD",
    cleanTicker: "USDA",
    collateralEnabled: false,
    address: "FBt9A5GA_KXMMSxA2DJ0xZbAq8sLLU2ak-YJe9zDvg8",
    icon: "seXozJrsP0OgI0gvAnr8zmfxiHHb5iSlI9wMI8SdamE",
    denomination: BigInt(12),
    //
    oAddress: "qX9KiT3p_KnV5RE7Dddghwc0uC5t-kvsVgjq2iLAi8s",
    oIcon: "p7iMD3X6iGYQ5Qw7dPU4ER7w678wEt2epwSA8t6-hu8",
    //
    deprecated: false,
    borrowingDisabled: false,
    borrowingDisabledReason: "",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
  },
  VAR: {
    name: "Vento Arweave",
    cleanTicker: "vAR",
    collateralEnabled: true,
    address: "y-p7CPhs6JMUStAuE4KeTnMXN7qYBvEi2hiBFk8ZhjM",
    icon: "XQKXtuxDGDn13z0JBqYvbkNXPu3Y3aE1WaK2XftQ3cA",
    denomination: BigInt(12),
    //
    oAddress: "TYaFOOJUwUjSCTi_CFNZXYAEt4SYTx-HNjrV-cCmwNQ",
    oIcon: "kjybk2--iRY9vxo2eQtVu52vbT8iWJzwBslhGPtTMeM",
    //
    deprecated: false,
    borrowingDisabled: false,
    borrowingDisabledReason: "",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
  },
  VUSDC: {
    name: "Vento USD Circle",
    cleanTicker: "vUSDC",
    collateralEnabled: true,
    address: "cxkFiGP89fEKOvbvl9SLs1lEaw0L-DWJiqQOuDPeDG8",
    icon: "DbT_EMed2vx4MR7N03YJYLSNeNBvuSgIzjybw8TOqMg",
    denomination: BigInt(6),
    //
    oAddress: "aKt8ZDDT43-3vwgqSEKx6aWd_3GA1paePP9EAOf3zcc",
    oIcon: "7EEISJIzxC-3RPhgvRc-lAZnP7st1b79_ER4Sc5P_MU",
    //
    deprecated: false,
    borrowingDisabled: false,
    borrowingDisabledReason: "",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
  },
  VDAI: {
    name: "Vento DAI",
    cleanTicker: "vDAI",
    collateralEnabled: true,
    address: "Q5Qk5W_AOUou2nRu1RlEpfr8yzKmWJ98tQb8QEyYqx4",
    icon: "0hn3-PiE45LzIr9fYxSEXrQu8qk9arXt-FsVoN98grw",
    denomination: BigInt(18),
    //
    oAddress: "UNj2195zpcrRcHdxWXq0zfsUMybbpfyFpyFpyaaLm03dW0",
    oIcon: "rCEwGR-OYAft5mAYqMOur7icDpxNCttyAuRqwJUjKSM",
    //
    deprecated: false,
    borrowingDisabled: false,
    borrowingDisabledReason: "",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
  },
  VETH: {
    name: "Vento Ethereum",
    cleanTicker: "vETH",
    collateralEnabled: true,
    address: "SGUZMZ1toA4k5wlDNyDtHQThf1SEAOLNwiE8TzsnSgw",
    icon: "zAQeInmLoCwtHfWzAebYWyrdb8Yh-s5H8_b4Ad2egSc",
    denomination: BigInt(18),
    //
    oAddress: "Sipm0KlrxYR7Pr_sKgedjIt1yzEQ0R6Yfkkuhd7Q0Og",
    oIcon: "z1nnBgzGpt-eXHrjD5A9KrQX6dK8E1ONDuBIqB94VTA",
    //
    deprecated: false,
    borrowingDisabled: false,
    borrowingDisabledReason: "",
    //
    get oTicker() {
      return `o${this.cleanTicker.toUpperCase()}`;
    },
    get ticker() {
      return this.cleanTicker.toUpperCase();
    },
    get baseDenomination() {
      return this.denomination;
    },
    controllerAddress,
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
