import { getData } from "../../ao/messaging/getData";
import {
  collateralEnabledTickers,
  tokens,
  controllerAddress,
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

export interface GetLiquidationsRes {
  liquidations: Map<string, QualifyingPosition>;
  usdDenomination: BigInt;
  prices: RedstonePrices;
}

export interface QualifyingPosition {
  /* The tokens that can be liquidated */
  debts: {
    ticker: string;
    quantity: BigInt;
  }[];
  /* The available collaterals that can be received for the liquidation */
  collaterals: {
    ticker: string;
    quantity: BigInt;
  }[];
  /** The current discount percentage for this liquidation (multiplied by the precision factor) */
  discount: BigInt;
}

export type RedstonePrices = Record<
  string,
  { t: number; a: string; v: number }
>;

interface Tag {
  name: string;
  value: string;
}

export async function getLiquidations(
  precisionFactor: number,
): Promise<GetLiquidationsRes> {
  try {
    if (!Number.isInteger(precisionFactor)) {
      throw new Error("The precision factor has to be an integer");
    }

    // Get list of tokens to process
    const tokensList = Object.keys(tokens);

    // Make a request to RedStone oracle process for prices (same used onchain)
    const redstonePriceFeedRes = await getData({
      Owner: controllerAddress,
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

    // get discovered liquidations
    const auctionsRes = await getData({
      Target: controllerAddress,
      Action: "Get-Auctions",
    });
    // add dry run await to not get rate limited
    await dryRunAwait(1);

    // parse prices and auctions
    const prices: RedstonePrices = JSON.parse(
      redstonePriceFeedRes.Messages[0].Data,
    );
    const auctions: Record<string, number> = JSON.parse(
      auctionsRes.Messages[0].Data,
    );

    // maximum discount percentage and discount period
    const auctionTags = Object.fromEntries(
      auctionsRes.Messages[0].Tags.map((tag: Tag) => [tag.name, tag.value]),
    );
    const maxDiscount = parseFloat(auctionTags["Initial-Discount"]);
    const discountInterval = parseInt(auctionTags["Discount-Interval"]);

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

    // Use shared calculation logic
    const { globalPositions, highestDenomination } = calculateGlobalPositions({
      positions: allPositions,
      prices,
    });

    // Initialize available liquidations object
    const res = new Map<string, QualifyingPosition>();

    // Initialize liquidations object for each supported token
    for (const [walletAddress, position] of globalPositions) {
      // Check if the position is eligible for liquidation
      // A position is eligible if borrowBalanceUSD > liquidationLimitUSD
      if (position.borrowBalanceUSD <= position.liquidationLimitUSD) continue;

      // time calculations for the discount
      const currentTime = Date.now();
      let timeSinceDiscovery =
        currentTime - (auctions[walletAddress] || currentTime);

      // maximum price reached, no discount applied
      if (timeSinceDiscovery > discountInterval) {
        timeSinceDiscovery = discountInterval;
      }

      // calculate the discount for this user
      const discount = BigInt(
        Math.max(
          Math.floor(
            ((discountInterval - timeSinceDiscovery) *
              maxDiscount *
              precisionFactor) /
              discountInterval,
          ),
          0,
        ),
      );

      // the final position that can be liquidated, with rewards and collaterals
      const qualifyingPos: QualifyingPosition = {
        debts: [],
        collaterals: [],
        discount,
      };

      // find rewards and debt
      for (const [token, localPosition] of Object.entries<TokenPosition>(
        position.tokenPositions,
      )) {
        // found a debt
        if ((localPosition.borrowBalance as bigint) > BigInt(0)) {
          qualifyingPos.debts.push({
            ticker: token,
            quantity: localPosition.borrowBalance,
          });
        }

        // found a reward
        if ((localPosition.collateralization as bigint) > BigInt(0)) {
          qualifyingPos.collaterals.push({
            ticker: token,
            quantity: localPosition.collateralization,
          });
        }
      }

      // add qualifying position as an opportunity to liquidate
      res.set(walletAddress, qualifyingPos);
    }

    return {
      liquidations: res,
      usdDenomination: highestDenomination,
      prices,
    };
  } catch (error) {
    throw new Error(`Error in getLiquidations function: ${error}`);
  }
}
