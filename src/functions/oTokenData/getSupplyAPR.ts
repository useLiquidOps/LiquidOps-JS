import { Quantity } from "ao-tokens";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import { getBorrowAPR, GetBorrowAPRRes } from "./getBorrowAPR";
import { getInfo, GetInfoRes } from "./getInfo";
import { dryRunAwait } from "../../ao/utils/dryRunAwait";
import { Services } from "../../ao/utils/connect";

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
}: GetSupplyAPR, config?: Services): Promise<GetSupplyAPRRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    if (!getBorrowAPRRes) {
      getBorrowAPRRes = await getBorrowAPR({ token }, config);
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
      getInfoRes = await getInfo({ token }, config);
    }

    const { totalBorrows, collateralDenomination, reserveFactor, totalSupply } =
      getInfoRes;

    const scaledCollateralDenomination = BigInt(collateralDenomination);

    const scaledTotalBorrows = new Quantity(
      totalBorrows,
      scaledCollateralDenomination,
    );
    const scaledTotalSupply = new Quantity(
      totalSupply,
      scaledCollateralDenomination,
    );

    // Utilization Rate = Total Borrowed / Total Supply
    const utilizationRate = Quantity.__div(
      scaledTotalBorrows,
      scaledTotalSupply,
    ).toNumber();

    // Reserve factor in fractions
    const reserveFactorFract = Number(reserveFactor) / 100;

    // Apply standard Compound V2 formula:
    // Supply APY = Borrow APY × Utilization Rate × (1 - Reserve Factor)
    return borrowAPY * utilizationRate * (1 - reserveFactorFract);
  } catch (error) {
    throw new Error("Error in getSupplyAPR function: " + error);
  }
}
