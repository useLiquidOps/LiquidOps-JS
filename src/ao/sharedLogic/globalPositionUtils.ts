import {
  tokenData,
  SupportedTokensTickers,
} from "../../ao/utils/tokenAddressData";
import { convertTicker } from "../../ao/utils/tokenAddressData";

// Base token position with the core metrics
export interface TokenPosition {
  borrowBalance: bigint;
  capacity: bigint;
  collateralization: bigint;
  liquidationLimit: bigint;
  ticker: string;
}

// Global position across all tokens
export interface GlobalPosition {
  borrowBalanceUSD: bigint;
  capacityUSD: bigint;
  collateralizationUSD: bigint;
  liquidationLimitUSD: bigint;
  usdDenomination: bigint;
  tokenPositions: {
    [token: string]: TokenPosition;
  };
}

type RedstonePrices = Record<string, { t: number; a: string; v: number }>;

// Shared utility for calculating global positions
interface CalculateGlobalPositionParams {
  positions: Record<string, Record<string, TokenPosition>>; // walletAddress -> token -> position
  prices: RedstonePrices;
}

interface CalculateGlobalPositionResult {
  globalPositions: Map<string, GlobalPosition>;
  highestDenomination: bigint;
}

export function calculateGlobalPositions({
  positions,
  prices,
}: CalculateGlobalPositionParams): CalculateGlobalPositionResult {
  const globalPositions = new Map<string, GlobalPosition>();
  let highestDenomination = BigInt(0);

  // First pass: find highest denomination
  for (const [walletAddress, walletPositions] of Object.entries(positions)) {
    for (const [token, position] of Object.entries(walletPositions)) {
      if (!position) continue;

      const tokenDenomination =
        tokenData[token as SupportedTokensTickers].denomination;
      if (highestDenomination < tokenDenomination) {
        highestDenomination = tokenDenomination;
      }
    }
  }

  // Second pass: calculate USD values
  for (const [walletAddress, walletPositions] of Object.entries(positions)) {
    const globalPosition: GlobalPosition = {
      borrowBalanceUSD: BigInt(0),
      capacityUSD: BigInt(0),
      collateralizationUSD: BigInt(0),
      liquidationLimitUSD: BigInt(0),
      usdDenomination: highestDenomination,
      tokenPositions: {},
    };

    for (const [token, position] of Object.entries(walletPositions)) {
      if (!position) continue;

      const tokenPosition: TokenPosition = {
        borrowBalance: BigInt(position.borrowBalance),
        capacity: BigInt(position.capacity),
        collateralization: BigInt(position.collateralization),
        liquidationLimit: BigInt(position.liquidationLimit),
        ticker: token,
      };

      globalPosition.tokenPositions[token] = tokenPosition;

      // Get token price and denomination for USD conversion
      const tokenPrice = prices[convertTicker(token)].v;
      const tokenDenomination =
        tokenData[token as SupportedTokensTickers].denomination;

      // Use the token's specific denomination for scaling
      const scale = BigInt(10) ** highestDenomination;
      const priceScaled = BigInt(Math.round(tokenPrice * Number(scale)));

      // The scale difference caused by the different token denominations
      const scaleDifference =
        BigInt(10) ** (highestDenomination - tokenDenomination);

      // Convert token values to USD
      const borrowBalanceUSD =
        (tokenPosition.borrowBalance * scaleDifference * priceScaled) / scale;
      const capacityUSD =
        (tokenPosition.capacity * scaleDifference * priceScaled) / scale;
      const collateralizationUSD =
        (tokenPosition.collateralization * scaleDifference * priceScaled) /
        scale;
      const liquidationLimitUSD =
        (tokenPosition.liquidationLimit * scaleDifference * priceScaled) /
        scale;

      // Add to global position totals
      globalPosition.borrowBalanceUSD += borrowBalanceUSD;
      globalPosition.capacityUSD += capacityUSD;
      globalPosition.collateralizationUSD += collateralizationUSD;
      globalPosition.liquidationLimitUSD += liquidationLimitUSD;
    }

    globalPositions.set(walletAddress, globalPosition);
  }

  return { globalPositions, highestDenomination };
}
