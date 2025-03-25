import { getData } from "../../ao/messaging/getData";
import {
  tokens,
  tokenData,
  SupportedTokensTickers,
  redstoneOracleAddress,
} from "../../ao/utils/tokenAddressData";
import { collateralEnabledTickers } from "../../ao/utils/tokenAddressData";
import { getPosition } from "./getPosition";

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
      Tickers: JSON.stringify(
        collateralEnabledTickers.map((ticker) => {
          if (ticker === "QAR") return "AR";
          if (ticker === "WUSDC") return "USDC";
          return ticker;
        }),
      ),
    });

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
      tokenPositions: {},
    };

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
      const tokenPrice = prices[token === "QAR" ? "AR" : token === "WUSDC" ? "USDC" : token].v;
      const tokenDenomination =
        tokenData[token as SupportedTokensTickers].denomination;

      // Use the token's specific denomination for scaling
      const scale = BigInt(10) ** BigInt(tokenDenomination);
      const priceScaled = BigInt(Math.round(tokenPrice * Number(scale)));

      // Convert token values to USD
      const borrowBalanceUSD =
        (tokenPosition.borrowBalance * priceScaled) / scale;
      const capacityUSD = (tokenPosition.capacity * priceScaled) / scale;
      const collateralizationUSD =
        (tokenPosition.collateralization * priceScaled) / scale;
      const liquidationLimitUSD =
        (tokenPosition.liquidationLimit * priceScaled) / scale;

      // Add to global position totals
      globalPosition.borrowBalanceUSD += borrowBalanceUSD;
      globalPosition.capacityUSD += capacityUSD;
      globalPosition.collateralizationUSD += collateralizationUSD;
      globalPosition.liquidationLimitUSD += liquidationLimitUSD;
    }

    return {
      globalPosition,
      prices,
    };
  } catch (error) {
    throw new Error(`Error in getGlobalPosition function: ${error}`);
  }
}
