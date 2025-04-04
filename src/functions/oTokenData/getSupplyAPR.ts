import { Quantity } from "ao-tokens";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import { getBorrowAPR, GetBorrowAPRRes } from "./getBorrowAPR";
import { getInfo, GetInfoRes } from "./getInfo";
import { dryRunAwait } from "../../ao/utils/dryRunAwait";

export interface GetSupplyAPR {
  token: TokenInput;
  getInfoRes?: GetInfoRes;
  getBorrowAPRRes?: GetBorrowAPRRes;
}

export type GetSupplyAPRRes = number;

export async function getSupplyAPR({
  token,
  getInfoRes,
  getBorrowAPRRes,
}: GetSupplyAPR): Promise<GetSupplyAPRRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    if (!getBorrowAPRRes) {
      getBorrowAPRRes = await getBorrowAPR({ token });
      // add await for 1 second due to double dry run request
      await dryRunAwait(1);
    }
    const borrowAPY = getBorrowAPRRes;

    const { tokenAddress } = tokenInput(token);
    // validate getInfoRes is for the correct token
    if (getInfoRes && getInfoRes.collateralId !== tokenAddress) {
      throw new Error("getInfoRes supplied does not match token supplied.");
    }
    if (!getInfoRes) {
      getInfoRes = await getInfo({ token });
    }

    const {
      totalBorrows,
      collateralDenomination,
      reserveFactor,
      totalSupply,
      collateralFactor,
      cash,
    } = getInfoRes;

    const scaledCollateralDenomination = BigInt(collateralDenomination);

    const scaledTotalBorrows = new Quantity(
      totalBorrows,
      scaledCollateralDenomination,
    );
    const scaledTotalSupply = new Quantity(
      totalSupply,
      scaledCollateralDenomination,
    );
    const scaledCash = new Quantity(cash, scaledCollateralDenomination);

    const scaledCollateralFactor = new Quantity(
      BigInt(0),
      scaledCollateralDenomination,
    ).fromString(collateralFactor);

    // get maximum amount of borrows allowed in a pool
    const scaledLTV = Quantity.__div(
      scaledCollateralFactor,
      new Quantity(BigInt(100), BigInt(0)),
    );
    const maximumPotentialBorrows = Quantity.__mul(
      scaledTotalSupply,
      scaledLTV,
    );
    // work out how much is not currently borrowed
    const notBorrowed = Quantity.__sub(
      maximumPotentialBorrows,
      scaledTotalBorrows,
    );
    // work out the un-utilized funds
    const unutilizedFunds = Quantity.__div(scaledCash, notBorrowed);
    // work out total amout pooled
    const totalPooled = Quantity.__add(scaledTotalBorrows, unutilizedFunds);

    // calculate the utilization rate and transform it
    // into a number (since the maximum value is 1)
    const utilizationRate = Quantity.__div(
      scaledTotalBorrows,
      totalPooled,
    ).toNumber();

    // reserve factor in fractions
    const reserveFactorFract = Number(reserveFactor) / 100;

    // ln(1+Borrow APY)
    const lnRes = Math.log(1 + borrowAPY);

    return Math.exp(lnRes * (1 - reserveFactorFract) * utilizationRate) - 1;
  } catch (error) {
    throw new Error("Error in getSupplyAPR function: " + error);
  }
}
