import { getData } from "../../ao/messaging/getData";
import { TokenInput } from "../../ao/utils/tokenInput";
import {
  collateralEnabledTickers,
  tokens,
  tokenData,
  SupportedTokensTickers,
  controllerAddress,
} from "../../ao/utils/tokenAddressData";
import { redstoneOracleAddress } from "../../ao/utils/tokenAddressData";
import { getAllPositions } from "../protocolData/getAllPositions";

export interface GetLiquidations {
  token: TokenInput;
}

export type GetLiquidationsRes = Map<string, QualifyingPosition>;

interface QualifyingPosition {
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
}

// Base token position with the core metrics
interface TokenPosition {
  borrowBalance: BigInt;
  capacity: BigInt;
  collateralization: BigInt;
  liquidationLimit: BigInt;
}

// Extended token position with USD values
interface TokenPositionUSD extends TokenPosition {
  borrowBalanceUSD: BigInt;
  capacityUSD: BigInt;
  collateralizationUSD: BigInt;
  liquidationLimitUSD: BigInt;
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

export async function getLiquidations({
  token,
}: GetLiquidations): Promise<GetLiquidationsRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    // Get list of tokens to process
    const tokensList = Object.keys(tokens);

    const [redstonePriceFeedRes, positionsList, auctions] = await Promise.all([
      // Make a request to RedStone oracle process for prices (same used onchain)
      getData({
        Target: redstoneOracleAddress,
        Action: "v2.Request-Latest-Data",
        Tickers: JSON.stringify(collateralEnabledTickers.map((ticker) =>
          ticker === "QAR" ? "AR" : ticker,
        )),
      }),
      // Get positions for each token
      Promise.all(
        tokensList.map(async (token) => ({
          token,
          positions: await getAllPositions({ token })
        }))
      ),
      // get discovered liquidations
      getData({
        Target: controllerAddress,
        Action: "Get-Auctions"
      })
    ]);
    
    // parse prices
    const prices = JSON.parse(redstonePriceFeedRes.Messages[0].Data);

    // Create a map to store global positions by wallet address
    const globalPositions = new Map<string, GlobalPosition>();

    // Calculate global positions for all wallets across all tokens
    for (const { token, positions: localPositions } of positionsList) {
      // token data
      const tokenPrice = prices[token === "QAR" ? "AR" : token].v;
      const tokenDenomination = tokenData[token as SupportedTokensTickers].denomination;

      // Use the token's specific denomination for scaling
      const scale = BigInt(10) ** tokenDenomination;
      const priceScaled = BigInt(Math.round(tokenPrice * Number(scale)));

      // loop through all positions, add them to the global positions
      for (const [walletAddress, position] of Object.entries<TokenPosition>(localPositions)) {
        const posValueUSD = {
          borrowBalanceUSD: position.borrowBalance as bigint * priceScaled / scale,
          capacityUSD: position.capacity as bigint * priceScaled / scale,
          collateralizationUSD: position.collateralization as bigint * priceScaled / scale,
          liquidationLimitUSD: position.liquidationLimit as bigint * priceScaled / scale
        };

        if (!globalPositions.has(walletAddress)) {
          // no global position calculated for this user yet
          globalPositions.set(walletAddress, {
            ...posValueUSD,
            tokenPositions: { [token]: position }
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

      const qualifyingPos: QualifyingPosition = {
        debts: [],
        collaterals: []
      };

      // find rewards and debt
      for (const [token, localPosition] of Object.entries<TokenPosition>(position.tokenPositions)) {
        // found a debt
        if (localPosition.borrowBalance as bigint > BigInt(0)) {
          qualifyingPos.debts.push({
            ticker: token,
            quantity: localPosition.borrowBalance
          });
        }

        // found a reward
        if (localPosition.collateralization as bigint > BigInt(0)) {
          qualifyingPos.collaterals.push({
            ticker: token,
            quantity: localPosition.collateralization
          });
        }
      }

      // add qualifying position as an opportunity to liquidate
      res.set(walletAddress, qualifyingPos);
    }

    return res;
  } catch (error) {
    throw new Error(`Error in getLiquidations function: ${error}`);
  }
}
