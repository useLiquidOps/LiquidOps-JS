import { getData } from "../../ao/messaging/getData";
import {
  tokens,
  tokenData,
  SupportedTokensTickers,
  redstoneOracleAddress,
} from "../../ao/utils/tokenAddressData";
import { collateralEnabledTickers } from "../../ao/utils/tokenAddressData";
import { getPosition } from "./getPosition";
import { dryRunAwait } from "../../ao/utils/dryRunAwait";
import { convertTicker } from "../../ao/utils/tokenAddressData";

// Base token position with the core metrics
interface TokenPosition {
  borrowBalance: bigint;
  capacity: bigint;
  collateralization: bigint;
  liquidationLimit: bigint;
  ticker: string;
}

// Global position across all tokens
interface GlobalPosition {
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

export interface GetGlobalPositionRes {
  globalPosition: GlobalPosition;
  prices: RedstonePrices;
}

export interface GetGlobalPosition {
  walletAddress: string;
}

export async function getGlobalPosition({
  walletAddress,
}: GetGlobalPosition): Promise<GetGlobalPositionRes> {
  try {
    if (!walletAddress) {
      throw new Error("Please specify a wallet address.");
    }

    // Get list of tokens to process
    const tokensList = Object.keys(tokens);

    // Make a request to RedStone oracle for prices
    const redstonePriceFeedRes = await getData({
      Target: redstoneOracleAddress,
      Action: "v2.Request-Latest-Data",
      Tickers: JSON.stringify(collateralEnabledTickers.map(convertTicker)),
    });
    // add dry run await to not get rate limited
    await dryRunAwait(1);

    // Parse prices
    const prices: RedstonePrices = JSON.parse(
      redstonePriceFeedRes.Messages[0].Data,
    );

    // Fetch positions for each token
    const positionsPromises = tokensList.map(async (token) => {
      try {
        const position = await getPosition({
          token,
          recipient: walletAddress,
        });
        // add dry run await to not get rate limited
        await dryRunAwait(1);

        return {
          token,
          position,
        };
      } catch (error) {
        // If position doesn't exist for this token, return null
        return {
          token,
          position: null,
        };
      }
    });

    const positionsResults = await Promise.all(positionsPromises);

    // Initialize global position
    const globalPosition: GlobalPosition = {
      borrowBalanceUSD: BigInt(0),
      capacityUSD: BigInt(0),
      collateralizationUSD: BigInt(0),
      liquidationLimitUSD: BigInt(0),
      usdDenomination: BigInt(0),
      tokenPositions: {},
    };

    // Highest denomination used
    let highestDenomination = BigInt(0);

    // Calculate global position for the wallet across all tokens
    for (const { token, position } of positionsResults) {
      // Skip if position doesn't exist for this token
      if (!position) continue;

      // Parse values to BigInt
      const tokenPosition: TokenPosition = {
        borrowBalance: BigInt(position.borrowBalance || 0),
        capacity: BigInt(position.capacity || 0),
        collateralization: BigInt(position.collateralization || 0),
        liquidationLimit: BigInt(position.liquidationLimit || 0),
        ticker: token,
      };

      // Store the token position
      globalPosition.tokenPositions[token] = tokenPosition;

      // Get token price and denomination for USD conversion
      const tokenPrice = prices[convertTicker(token)].v;
      const tokenDenomination =
        tokenData[token as SupportedTokensTickers].baseDenomination;

      // Set the highest denomination
      if (highestDenomination < tokenDenomination)
        highestDenomination = tokenDenomination;

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

    // Set USD denomination (should be the highest used denomination)
    globalPosition.usdDenomination = highestDenomination;

    return {
      globalPosition,
      prices,
    };
  } catch (error) {
    throw new Error(`Error in getGlobalPosition function: ${error}`);
  }
}
