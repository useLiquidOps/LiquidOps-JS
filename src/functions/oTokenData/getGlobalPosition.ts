import { getData } from "../../ao/messaging/getData";
import {
  tokens,
  redstoneOracleAddress,
  controllerAddress,
} from "../../ao/utils/tokenAddressData";
import { collateralEnabledTickers } from "../../ao/utils/tokenAddressData";
import { getPosition } from "./getPosition";
import { dryRunAwait } from "../../ao/utils/dryRunAwait";
import { convertTicker } from "../../ao/utils/tokenAddressData";
import {
  calculateGlobalPositions,
  TokenPosition,
  GlobalPosition,
} from "../../ao/sharedLogic/globalPositionUtils";

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
      Owner: controllerAddress,
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
      const maxRetries = 3;
      const retryDelay = 5000; // 5 seconds

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
          console.log(`Attempt ${attempt} failed for token ${token}:`, error);

          if (attempt === maxRetries) {
            // Final attempt failed, throw error
            throw new Error(
              `Failed to get position for token ${token} after ${maxRetries} attempts: ${error}`,
            );
          }

          // Wait 3 seconds before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }

      // This should never be reached, but TypeScript needs it
      return {
        token,
        position: null,
      };
    });

    const positionsResults = await Promise.all(positionsPromises);

    // Convert to the format expected by calculateGlobalPositions
    const positions: Record<string, Record<string, TokenPosition>> = {
      [walletAddress]: {},
    };

    for (const { token, position } of positionsResults) {
      if (position) {
        // Parse values to BigInt and add ticker
        const tokenPosition: TokenPosition = {
          borrowBalance: BigInt(position.borrowBalance),
          capacity: BigInt(position.capacity),
          collateralization: BigInt(position.collateralization),
          liquidationLimit: BigInt(position.liquidationLimit),
          ticker: token,
        };
        positions[walletAddress][token] = tokenPosition;
      }
    }

    // Use shared calculation logic
    const { globalPositions } = calculateGlobalPositions({
      positions,
      prices,
    });

    const globalPosition = globalPositions.get(walletAddress)!;

    return {
      globalPosition,
      prices,
    };
  } catch (error) {
    throw new Error(`Error in getGlobalPosition function: ${error}`);
  }
}
