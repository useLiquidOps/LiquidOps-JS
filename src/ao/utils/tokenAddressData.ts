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
}

const controllerAddress = "vYlv6Dx8ZGt4oGaqsXaPjh9qi8iS8eQsoU9Ai65km4A";

export const tokenData: Record<string, TokenData> = {
  QAR: {
    name: "Quantum Arweave",
    icon: "8VLMb0c9NATl4iczfwpMDe1Eh8kFWIUpSlIkcGfDFzM",
    ticker: "QAR",
    address: "XJYGT9ZrVdzQ5d7FzptIsKrJtEF4jWPbgC91bXuBAwU",
    oTicker: "oQAR",
    oAddress: "haBc5vp4paD5CDbTz2maZ1W61oatRmpeVF3FiWVcz2M",
    controllerAddress,
    cleanTicker: "qAR",
    denomination: BigInt(12)
  },
  STETH: {
    name: "Staked Ethereum",
    icon: "UHjR0nY25BJ61LVSugyXCSoig07jv84LA6Wp_kYRfYI",
    ticker: "STETH",
    address: "GUJI7zjPoJ0uAHIBWiYrKL2bpwfltTZFXNL4J-IV8AI",
    oTicker: "oSTETH",
    oAddress: "xwSkPM75xVXq2KMWuqtkp86X4_Czh7Xi37o1YcnPYnw",
    controllerAddress,
    cleanTicker: "stETH",
    denomination: BigInt(12)
  },
  USDC: {
    name: "USD Circle",
    icon: "iNYk0bDqUiH0eLT2rbYjYAI5i126R4ye8iAZb55IaIM",
    ticker: "USDC",
    address: "EoGGnxiSIUr0C5aZhTA_c8WipuASleomMrvyvuJCKvM",
    oTicker: "oUSDC",
    oAddress: "2lLrSCh-LSNK40i7jKCqw9IyLAw1gXeYNGwt-dWdMoE",
    controllerAddress,
    cleanTicker: "USDC",
    denomination: BigInt(12)
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
