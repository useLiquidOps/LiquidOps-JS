export interface TokenData {
  ticker: string;
  address: string;
  oTicker: string;
  oAddress: string;
}

const tokenData: Record<string, TokenData> = {
  wAR: {
    ticker: "wAR",
    address: "mmnvTHBi6gRWhY_Wtz08oxGq1DEtzkPKKdzNAi9XyPo",
    oTicker: "owAR",
    oAddress: "2bCBzCi3Tr4RXAIumBdesr0IcDCBhfxFU8RXbO98c04",
  },
  stETH: {
    ticker: "stETH",
    address: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
    oTicker: "ostETH",
    oAddress: "EO54_9d715SEqSXxx-nNsXqMyRgqyrYNIqb_OXSxSXA",
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
