import { getData } from "../../ao/messaging/getData";
import { TokenInput } from "../../ao/utils/tokenInput";
import {
  collateralEnabledTickers,
  tokens,
  tokenData,
  SupportedTokensTickers,
} from "../../ao/utils/tokenAddressData";
import { redstoneOracleAddress } from "../../ao/utils/tokenAddressData";
import { getAllPositions } from "../protocolData/getAllPositions";

export interface GetLiquidations {
  token: TokenInput;
}

export interface GetLiquidationsRes {
  // Ticker of the collateral the liquidator will pay with
  [ticker: string]: Liquidations[];
}

interface Liquidations {
  target: string; // liquidation target wallet addr (the user that will get liquidated)
  collaterals: {
    // the array of collaterals the user holds in their position
    ticker: string; // the collateral's ticker
    quantity: BigInt; // the amount of tokens the user holds of this collateral
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
    [token: string]: TokenPositionUSD;
  };
}

export async function getLiquidations({
  token,
}: GetLiquidations): Promise<GetLiquidationsRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    // Make a request to RedStone oracle process for prices (same used onchain)
    const mappedTickers = collateralEnabledTickers.map((ticker) =>
      ticker === "QAR" ? "AR" : ticker,
    );
    const redstonePriceFeedRes = await getData({
      Target: redstoneOracleAddress,
      Action: "v2.Request-Latest-Data",
      Tickers: JSON.stringify(mappedTickers),
    });

    const prices = JSON.parse(redstonePriceFeedRes.Messages[0].Data);

    // Get list of tokens to process
    const tokensList = Object.keys(tokens);

    // Get positions for each token
    const positionsList = [];
    for (const tokenTicker of tokensList) {
      const allPositions = await getAllPositions({
        token: tokenTicker,
      });
      positionsList.push(allPositions);
    }

    // Create an object to store global positions by wallet address
    const globalPositions: { [walletAddress: string]: GlobalPosition } = {};

    // Calculate global positions for all wallets across all tokens
    for (let i = 0; i < positionsList.length; i++) {
      const tokenPositions = positionsList[i] as {
        [walletAddress: string]: TokenPosition;
      };
      const token = tokensList[i];
      const tokenPrice = prices[token === "QAR" ? "AR" : token].v;

      // Get the token's denomination (decimal places)
      const denomination =
        tokenData[token as SupportedTokensTickers].denomination;

      // Loop through each wallet's position for this token
      for (const walletAddress in tokenPositions) {
        const position = tokenPositions[walletAddress];

        // If this wallet doesn't exist in globalPositions yet, initialize it
        if (!globalPositions[walletAddress]) {
          globalPositions[walletAddress] = {
            borrowBalanceUSD: BigInt(0),
            capacityUSD: BigInt(0),
            collateralizationUSD: BigInt(0),
            liquidationLimitUSD: BigInt(0),
            tokenPositions: {},
          };
        }

        // Use the token's specific denomination for scaling
        const scale = BigInt(10) ** denomination;
        const priceScaled = BigInt(Math.round(tokenPrice * Number(scale)));

        // Calculate USD values with proper token-specific scaling
        // Scale price and amount up, then divide by scale to be as precise as possible
        const borrowBalanceUSD =
          (Number(position.borrowBalance) * Number(priceScaled)) /
          Number(scale);
        const capacityUSD =
          (Number(position.capacity) * Number(priceScaled)) / Number(scale);
        const collateralizationUSD =
          (Number(position.collateralization) * Number(priceScaled)) /
          Number(scale);
        const liquidationLimitUSD =
          (Number(position.liquidationLimit) * Number(priceScaled)) /
          Number(scale);

        // Add to global positions
        globalPositions[walletAddress].borrowBalanceUSD = BigInt(
          Number(globalPositions[walletAddress].borrowBalanceUSD) +
            borrowBalanceUSD,
        );
        globalPositions[walletAddress].capacityUSD = BigInt(
          Number(globalPositions[walletAddress].capacityUSD) + capacityUSD,
        );
        globalPositions[walletAddress].collateralizationUSD = BigInt(
          Number(globalPositions[walletAddress].collateralizationUSD) +
            collateralizationUSD,
        );
        globalPositions[walletAddress].liquidationLimitUSD = BigInt(
          Number(globalPositions[walletAddress].liquidationLimitUSD) +
            liquidationLimitUSD,
        );

        // Store the individual token position for reference
        globalPositions[walletAddress].tokenPositions[token] = {
          borrowBalance: position.borrowBalance,
          borrowBalanceUSD: BigInt(borrowBalanceUSD),
          capacity: position.capacity,
          capacityUSD: BigInt(capacityUSD),
          collateralization: position.collateralization,
          collateralizationUSD: BigInt(collateralizationUSD),
          liquidationLimit: position.liquidationLimit,
          liquidationLimitUSD: BigInt(liquidationLimitUSD),
        };
      }
    }

    // Initialize available liquidations object
    const availableLiquidations: GetLiquidationsRes = {};

    // Initialize liquidations object for each supported token
    for (const ticker of tokensList) {
      availableLiquidations[ticker] = [];
    }

    // Check each wallet's global position to see if it's eligible for liquidation
    for (const walletAddress in globalPositions) {
      const position = globalPositions[walletAddress];

      // Check if the position is eligible for liquidation
      // A position is eligible if borrowBalanceUSD >= liquidationLimitUSD
      if (
        Number(position.borrowBalanceUSD) >=
        Number(position.liquidationLimitUSD)
      ) {
        // This wallet is eligible for liquidation

        // Collect all collaterals this wallet holds across all tokens
        const collaterals: Array<{ ticker: string; quantity: BigInt }> = [];

        for (const tokenTicker in position.tokenPositions) {
          const tokenPosition = position.tokenPositions[tokenTicker];
          collaterals.push({
            ticker: tokenTicker,
            quantity: tokenPosition.collateralization,
          });
        }

        // Add this liquidation opportunity to each supported token's list
        // TODO: check with Marton
        for (const ticker of tokensList) {
          availableLiquidations[ticker].push({
            target: walletAddress,
            collaterals: collaterals,
          });
        }
      }
    }

    return availableLiquidations;
  } catch (error) {
    throw new Error(`Error in getLiquidations function: ${error}`);
  }
}
