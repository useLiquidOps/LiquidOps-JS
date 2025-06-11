import { GetGlobalPositionRes } from "liquidops";
import { Quantity } from "ao-tokens";
import { getBaseDenomination } from "./getBaseDenomination";
import { tokenData } from "liquidops";

interface TokenPositionResult {
  borrowBalance: Quantity;
  capacity: Quantity;
  collateralization: Quantity;
  liquidationLimit: Quantity;
  ticker: string;
}

interface GlobalPositionResult {
  collateralValueUSD: Quantity;
  borrowCapacityUSD: Quantity;
  liquidationPointUSD: Quantity;
  availableToBorrowUSD: Quantity;
  tokenPositions: {
    [token: string]: TokenPositionResult;
  };
}

export function formatGlobalPosition(globalPosition: GetGlobalPositionRes) {
  // turn Bigints to Quantities
  const formattedTokenResult: { [token: string]: TokenPositionResult } = {};

  for (const [ticker, position] of Object.entries(
    globalPosition.globalPosition.tokenPositions,
  )) {
    const denomination = getBaseDenomination(ticker.toUpperCase());
    formattedTokenResult[ticker] = {
      borrowBalance: new Quantity(position.borrowBalance, denomination),

      capacity: new Quantity(position.capacity, denomination),

      collateralization: new Quantity(position.collateralization, denomination),
      liquidationLimit: new Quantity(position.liquidationLimit, denomination),

      ticker,
    };
  }

  // Create the result with Quantity objects
  const result: GlobalPositionResult = {
    collateralValueUSD: new Quantity(
      globalPosition.globalPosition.collateralizationUSD,
      globalPosition.globalPosition.usdDenomination,
    ),
    borrowCapacityUSD: new Quantity(
      globalPosition.globalPosition.capacityUSD,
      globalPosition.globalPosition.usdDenomination,
    ),
    liquidationPointUSD: new Quantity(
      globalPosition.globalPosition.liquidationLimitUSD,
      globalPosition.globalPosition.usdDenomination,
    ),
    availableToBorrowUSD: new Quantity(
      globalPosition.globalPosition.capacityUSD -
        globalPosition.globalPosition.borrowBalanceUSD,
      globalPosition.globalPosition.usdDenomination,
    ),
    tokenPositions: formattedTokenResult,
  };
  let message = "";
  message += `\n\n*Collateral value USD:* ${result.collateralValueUSD.toString()}`;
  message += `\n\n*Borrow capacity value USD:* ${result.borrowCapacityUSD.toString()}`;
  message += `\n\n*Liquidation point USD:* ${result.liquidationPointUSD.toString()}`;
  message += `\n\n*Available to borrow USD:* ${result.availableToBorrowUSD.toString()}`;

  message += `\n\n*Token positions: *\n`;

  Object.entries(result.tokenPositions).forEach(([ticker, position]) => {
    const collateral = formatQuantity(ticker, position.collateralization.raw);
    const borrowBalance = formatQuantity(ticker, position.borrowBalance.raw);
    const capacity = formatQuantity(ticker, position.capacity.raw);
    const liquidationLimit = formatQuantity(
      ticker,
      position.liquidationLimit.raw,
    );
    message += `  • ${position.ticker}: collateral: ${collateral}, borrowBalance: ${borrowBalance}, capacity: ${capacity}, liquidationLimit: ${liquidationLimit}\n`;
  });

  return message;
}

function formatQuantity(ticker: string, quantity: BigInt): number {
  const decimals = tokenData[ticker.toUpperCase()].denomination;
  return Number(quantity) / 10 ** Number(decimals);
}
