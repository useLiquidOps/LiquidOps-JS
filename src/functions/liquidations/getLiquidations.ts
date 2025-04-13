import { getData } from "../../ao/messaging/getData";
import {
  collateralEnabledTickers,
  tokens,
  tokenData,
  SupportedTokensTickers,
  controllerAddress,
} from "../../ao/utils/tokenAddressData";
import { redstoneOracleAddress } from "../../ao/utils/tokenAddressData";
import { getAllPositions } from "../protocolData/getAllPositions";
import { dryRunAwait } from "../../ao/utils/dryRunAwait";

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

// Base token position with the core metrics
interface TokenPosition {
  borrowBalance: BigInt;
  capacity: BigInt;
  collateralization: BigInt;
  liquidationLimit: BigInt;
}

// Global position across all tokens
interface GlobalPosition {
  borrowBalanceUSD: BigInt;
  capacityUSD: BigInt;
  collateralizationUSD: BigInt;
  liquidationLimitUSD: BigInt;
  tokenPositions: {
    [token: string]: TokenPosition;
  };
}

function convertTicker(ticker: string): string {
  if (ticker === "QAR") return "AR";
  if (ticker === "WUSDC") return "USDC";
  return ticker;
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
      Target: redstoneOracleAddress,
      Action: "v2.Request-Latest-Data",
      Tickers: JSON.stringify(collateralEnabledTickers.map(convertTicker)),
    });

    // add dry run await to not get rate limited
    await dryRunAwait(1);

    // Get positions for each token
    const positionsList = [];
    for (const token of tokensList) {
      const positions = await getAllPositions({ token });
      positionsList.push({
        token,
        positions,
      });
      // add dry run await to not get rate limited
      await dryRunAwait(1);
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
    const maxDiscount = parseFloat(auctionTags["Initial-Discount"] || "0");
    const discountInterval = parseInt(auctionTags["Discount-Interval"] || "0");

    // Create a map to store global positions by wallet address
    const globalPositions = new Map<string, GlobalPosition>();

    // Highest denomination used
    let highestDenomination = BigInt(0);

    // Calculate global positions for all wallets across all tokens
    for (const { token, positions: localPositions } of positionsList) {
      // token data
      const tokenPrice = prices[convertTicker(token)].v;
      const tokenDenomination =
        tokenData[token as SupportedTokensTickers].denomination;

      // Set the highest denomination
      if (highestDenomination < tokenDenomination)
        highestDenomination = tokenDenomination;

      // Use the token's specific denomination for scaling
      const scale = BigInt(10) ** highestDenomination;
      const priceScaled = BigInt(Math.round(tokenPrice * Number(scale)));

      // The scale difference caused by the different token denominations
      const scaleDifference =
        BigInt(10) ** (highestDenomination - tokenDenomination);

      // loop through all positions, add them to the global positions
      for (const [walletAddress, position] of Object.entries<TokenPosition>(
        localPositions,
      )) {
        const posValueUSD = {
          borrowBalanceUSD:
            ((position.borrowBalance as bigint) *
              scaleDifference *
              priceScaled) /
            scale,
          capacityUSD:
            ((position.capacity as bigint) * scaleDifference * priceScaled) /
            scale,
          collateralizationUSD:
            ((position.collateralization as bigint) *
              scaleDifference *
              priceScaled) /
            scale,
          liquidationLimitUSD:
            ((position.liquidationLimit as bigint) *
              scaleDifference *
              priceScaled) /
            scale,
        };

        if (!globalPositions.has(walletAddress)) {
          // no global position calculated for this user yet
          globalPositions.set(walletAddress, {
            ...posValueUSD,
            tokenPositions: { [token]: position },
          });
        } else {
          // update existing global position
          const globalPos = globalPositions.get(walletAddress);

          // @ts-expect-error
          globalPos!.borrowBalanceUSD += posValueUSD.borrowBalanceUSD;
          // @ts-expect-error
          globalPos!.capacityUSD += posValueUSD.capacityUSD;
          // @ts-expect-error
          globalPos!.collateralizationUSD += posValueUSD.collateralizationUSD;
          // @ts-expect-error
          globalPos!.liquidationLimitUSD += posValueUSD.liquidationLimitUSD;
          globalPos!.tokenPositions[token] = position;
        }
      }
    }

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
