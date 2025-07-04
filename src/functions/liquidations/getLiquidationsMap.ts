import { getData } from "../../ao/messaging/getData";
import {
  collateralEnabledTickers,
  tokens,
} from "../../ao/utils/tokenAddressData";
import { redstoneOracleAddress } from "../../ao/utils/tokenAddressData";
import {
  getAllPositions,
  GetAllPositionsRes,
} from "../protocolData/getAllPositions";
import { dryRunAwait } from "../../ao/utils/dryRunAwait";
import { convertTicker } from "../../ao/utils/tokenAddressData";
import {
  calculateGlobalPositions,
  TokenPosition,
} from "../../ao/sharedLogic/globalPositionUtils";
import { RedstonePrices } from "./getLiquidations";

export interface GetLiquidationsMapRes {
  /** The wallet/user address that owns this position */
  walletAddress: string;
  /** Current amount borrowed by this wallet in USD (formatted) */
  borrowBalance: number;
  /** Current collateral value for this wallet in USD (formatted) */
  collateralizationUSD: number;
  /** Maximum amount this wallet can borrow before liquidation in USD (formatted) */
  liquidationLimit: number;
  /** How close to liquidation (0-100%): 0 = no debt, 100+ = liquidatable */
  proximityPercentage: number;
  /** Risk level: Safe (<70%), Warning (70-89%), Danger (90-99%), Liquidatable (100%+) */
  status: "Safe" | "Warning" | "Danger" | "Liquidatable";
  /** Additional amount this wallet can still borrow before hitting liquidation in USD (formatted) */
  remainingCapacity: number;
}

export async function getLiquidationsMap(): Promise<GetLiquidationsMapRes[]> {
  try {
    // Get list of tokens to process
    const tokensList = Object.keys(tokens);

    // Make a request to RedStone oracle process for prices (same used onchain)
    const redstonePriceFeedRes = await getData({
      Target: redstoneOracleAddress,
      Action: "v2.Request-Latest-Data",
      Tickers: JSON.stringify(collateralEnabledTickers.map(convertTicker)),
    });

    // add dry run await to not get rate limited
    await dryRunAwait(1);

    // Get positions for each token
    const positionsList = [];
    for (const token of tokensList) {
      const maxRetries = 3;
      const retryDelay = 3000; // 3 seconds

      let positions: GetAllPositionsRes | null = null;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          positions = await getAllPositions({ token });
          // add dry run await to not get rate limited
          await dryRunAwait(1);
          break; // Success, exit retry loop
        } catch (error) {
          console.log(
            `Attempt ${attempt} failed for getAllPositions with token ${token}:`,
            error,
          );

          if (attempt === maxRetries) {
            // Final attempt failed, throw error
            throw new Error(
              `Failed to get all positions for token ${token} after ${maxRetries} attempts: ${error}`,
            );
          }

          // Wait 3 seconds before retrying
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }

      // At this point, positions should never be null because we either succeeded or threw an error
      if (!positions) {
        throw new Error(`Unexpected: positions is null for token ${token}`);
      }

      positionsList.push({
        token,
        positions,
      });
    }

    // parse prices
    const prices: RedstonePrices = JSON.parse(
      redstonePriceFeedRes.Messages[0].Data,
    );

    // Convert positions to the format expected by calculateGlobalPositions
    const allPositions: Record<string, Record<string, TokenPosition>> = {};

    for (const { token, positions: localPositions } of positionsList) {
      for (const [walletAddress, position] of Object.entries(localPositions)) {
        if (!allPositions[walletAddress]) {
          allPositions[walletAddress] = {};
        }
        // Convert the position to match our TokenPosition interface
        allPositions[walletAddress][token] = {
          borrowBalance: position.borrowBalance as bigint,
          capacity: position.capacity as bigint,
          collateralization: position.collateralization as bigint,
          liquidationLimit: position.liquidationLimit as bigint,
          ticker: token,
        };
      }
    }

    // Use shared calculation logic to get global positions
    const { globalPositions, highestDenomination } = calculateGlobalPositions({
      positions: allPositions,
      prices,
    });

    const results: GetLiquidationsMapRes[] = [];

    // Helper function to format USD values (similar to formatQuantity in your notification function)
    const formatUSDValue = (value: bigint): number => {
      // Convert from the highest denomination to readable USD format
      return Number(value) / 10 ** Number(highestDenomination);
    };

    // Process each global position
    for (const [walletAddress, position] of globalPositions) {
      const borrowBalanceRaw = position.borrowBalanceUSD;
      const collateralizationUSDRaw = position.collateralizationUSD;
      const liquidationLimitRaw = position.liquidationLimitUSD;

      // Skip positions with no borrow balance
      if (borrowBalanceRaw === BigInt(0)) {
        continue;
      }

      // Skip positions with no liquidation limit (no collateral/borrowing activity)
      if (liquidationLimitRaw === BigInt(0)) {
        continue;
      }

      // Format the values for display
      const borrowBalance = formatUSDValue(borrowBalanceRaw);
      const collateralizationUSD = formatUSDValue(collateralizationUSDRaw);
      const liquidationLimit = formatUSDValue(liquidationLimitRaw);

      // Calculate proximity percentage
      let proximityPercentage: number;
      let status: "Safe" | "Warning" | "Danger" | "Liquidatable";
      let remainingCapacity: number;

      if (borrowBalanceRaw >= liquidationLimitRaw) {
        // Already liquidatable
        proximityPercentage = 100;
        status = "Liquidatable";
        remainingCapacity = 0;
      } else {
        // Calculate how close they are to liquidation (0-99%)
        proximityPercentage = Number(
          (borrowBalanceRaw * BigInt(100)) / liquidationLimitRaw,
        );
        remainingCapacity = formatUSDValue(
          liquidationLimitRaw - borrowBalanceRaw,
        );

        // Determine status based on proximity
        if (proximityPercentage >= 90) {
          status = "Danger";
        } else if (proximityPercentage >= 70) {
          status = "Warning";
        } else {
          status = "Safe";
        }
      }

      results.push({
        walletAddress,
        borrowBalance,
        collateralizationUSD,
        liquidationLimit,
        proximityPercentage: Math.round(proximityPercentage * 100) / 100, // Round to 2 decimal places
        status,
        remainingCapacity,
      });
    }

    // Sort by proximity percentage (most at risk first)
    return results.sort(
      (a, b) => b.proximityPercentage - a.proximityPercentage,
    );
  } catch (error) {
    throw new Error(`Error in getLiquidationsMap function: ${error}`);
  }
}