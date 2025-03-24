import {
  SupportedTokensTickers,
  tokenData,
} from "../../ao/utils/tokenAddressData";
import { QualifyingPosition, RedstonePrices } from "./getLiquidations";

/**
 * Get a token's value in another token, using the USD price feed provided
 */
function getTokenValue(
  from: { token: string; quantity: BigInt },
  to: string,
  prices: RedstonePrices,
) {
  // token datas
  const fromData = {
    price: prices[from.token === "QAR" ? "AR" : from.token].v,
    scale:
      BigInt(10) **
      tokenData[from.token as SupportedTokensTickers].denomination,
  };
  const fromScaledPrice = BigInt(
    Math.round(fromData.price * Number(fromData.scale)),
  );
  const toData = {
    price: prices[to === "QAR" ? "AR" : to].v,
    scale: BigInt(10) ** tokenData[to as SupportedTokensTickers].denomination,
  };
  const toScaledPrice = BigInt(Math.round(toData.price * Number(toData.scale)));

  // calculate the value of the quantity in USD
  const fromValUSD =
    ((from.quantity as bigint) * fromScaledPrice) / fromData.scale;

  // calculate the USD val in the provided token
  return (fromValUSD * toData.scale) / toScaledPrice;
}

export type GetDiscountedQuantityRes = BigInt;

export interface GetDiscountedQuantity {
  /** The token that will be sent pay for the dept of the target */
  liquidated: {
    token: string;
    quantity: BigInt;
  };
  /** The token received for the liquidation */
  rewardToken: string;
  /** The position that qualified for the liquidation */
  qualifyingPosition: QualifyingPosition;
  /** Redstone price data from getLiquidations() */
  priceData: RedstonePrices;
  /**
   * Optionally validate the liqidated token quantity and the discounted quantity.
   * This will throw an error if any of these quantities are more than what the user
   * holds
   */
  validateMax?: boolean;
}

export function getDiscountedQuantity(
  {
    liquidated,
    rewardToken,
    qualifyingPosition,
    priceData,
    validateMax = false,
  }: GetDiscountedQuantity,
  precisionFactor: number,
): GetDiscountedQuantityRes {
  if (!Number.isInteger(precisionFactor)) {
    throw new Error("The precision factor has to be an integer");
  }

  // find dept and reward
  const dept = qualifyingPosition.debts.find(
    (d) => d.ticker === liquidated.token,
  );
  const reward = qualifyingPosition.collaterals.find(
    (c) => c.ticker === rewardToken,
  );

  if (!dept || !reward) {
    throw new Error(
      "Liquidated token or reward token is not in the user's position",
    );
  }
  if (validateMax && dept.quantity < liquidated.quantity) {
    throw new Error("Not enough tokens to liquidate");
  }

  // calculate the value of the liquidated token in the reward token
  let marketValue = getTokenValue(liquidated, rewardToken, priceData);

  // calculate discount
  if ((qualifyingPosition.discount as bigint) > BigInt(0)) {
    const precise100 = BigInt(100 * precisionFactor);
    marketValue =
      (marketValue * (precise100 + (qualifyingPosition.discount as bigint))) /
      precise100;
  }

  // validate
  if (validateMax && (reward.quantity as bigint) < marketValue) {
    throw new Error("Not enough tokens to receive as reward");
  }

  return marketValue;
}
