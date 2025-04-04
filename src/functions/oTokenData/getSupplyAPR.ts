import { Quantity } from "ao-tokens";
import { TokenInput } from "../../ao/utils/tokenInput";
import { getBorrowAPR } from "./getBorrowAPR";
import { getInfo } from "./getInfo";

export interface GetSupplyAPR {
  token: TokenInput;
}

export type GetSupplyAPRRes = number;

export async function getSupplyAPR({
  token,
}: GetSupplyAPR): Promise<GetSupplyAPRRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const borrowAPY = await getBorrowAPR({ token });

    const {
      totalBorrows,
      denomination,
      reserveFactor,
      totalSupply,
      collateralFactor,
      cash,
    } = await getInfo({ token });

    const scaledTotalBorrows = new Quantity(totalBorrows, BigInt(denomination));
    const scaledTotalSupply = new Quantity(totalSupply, BigInt(denomination));
    const scaledCash = new Quantity(cash, BigInt(denomination));

    const scaledCollateralFactor = new Quantity(collateralFactor); // TODO: check with Marton

    // get maximum amount of borrows allowed in a pool
    const scaledLTV = Quantity.__div(scaledCollateralFactor, 100) // TODO: check with Marton
    const maximumPotentialBorrows = Quantity.__mul(scaledTotalSupply, scaledLTV)
    // work out how much is not currently borrowed
    const notBorrowed = Quantity.__sub(maximumPotentialBorrows, scaledTotalBorrows)
    // work out the un-utilized funds
    const unutilizedFunds = Quantity.__div(scaledCash, notBorrowed)
    // work out total amout pooled
    const totalPooled = Quantity.__add(scaledTotalBorrows, unutilizedFunds)

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
