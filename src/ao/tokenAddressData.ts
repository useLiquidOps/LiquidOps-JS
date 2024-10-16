export type SupportedTokensTickers = "wAR" | "stETH";

export type SupportedTokensAddresses = "mmnvTHBi6gRWhY_Wtz08oxGq1DEtzkPKKdzNAi9XyPo" | "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick";

export const tokens: Record<SupportedTokensTickers, SupportedTokensAddresses> =
  {
    wAR: "mmnvTHBi6gRWhY_Wtz08oxGq1DEtzkPKKdzNAi9XyPo",
    stETH: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
  };

export type SupportedOTokensTickers = "owAR" | "ostETH";

export type SupportedOTokensAddresses = "2bCBzCi3Tr4RXAIumBdesr0IcDCBhfxFU8RXbO98c04" | "EO54_9d715SEqSXxx-nNsXqMyRgqyrYNIqb_OXSxSXA";

export const oTokens: Record<
  SupportedOTokensTickers,
  SupportedOTokensAddresses
> = {
  owAR: "2bCBzCi3Tr4RXAIumBdesr0IcDCBhfxFU8RXbO98c04",
  ostETH: "EO54_9d715SEqSXxx-nNsXqMyRgqyrYNIqb_OXSxSXA",
};
