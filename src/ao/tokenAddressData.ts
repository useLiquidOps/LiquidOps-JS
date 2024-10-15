export type SupportedTokensTickers = "wAR" | "stETH";

export type SupportedTokensAddresses = "123" | "456";

export const tokens: Record<SupportedTokensTickers, SupportedTokensAddresses> =
  {
    wAR: "123",
    stETH: "456",
  };

export type SupportedOTokensTickers = "owAR" | "ostETH";

export type SupportedOTokensAddresses = "123" | "456";

export const oTokens: Record<
  SupportedOTokensTickers,
  SupportedOTokensAddresses
> = {
  owAR: "123",
  ostETH: "456",
};
