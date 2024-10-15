export type SupportedTokensTickers = "wAR" | "stETH";

export type SupportedTokensAddresses =
  | "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick"
  | "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick";

export const tokens: Record<SupportedTokensTickers, SupportedTokensAddresses> =
  {
    wAR: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
    stETH: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
  };

export type SupportedOTokensTickers = "owAR" | "ostETH";

export type SupportedOTokensAddresses =
  | "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick"
  | "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick";

export const oTokens: Record<
  SupportedOTokensTickers,
  SupportedOTokensAddresses
> = {
  owAR: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
  ostETH: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
};
