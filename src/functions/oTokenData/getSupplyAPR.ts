import { Quantity } from "ao-tokens";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import { getBorrowAPR, GetBorrowAPRRes } from "./getBorrowAPR";
import { getInfo, GetInfoRes } from "./getInfo";
import { dryRunAwait } from "../../ao/utils/dryRunAwait";
import { Services } from "../../ao/utils/connect";
import { getEnvironment } from "./getEnvironment";
import { getCurrentState } from "./getCurrentState";
import { tokenData } from "../../ao/utils/tokenAddressData";

export interface GetSupplyAPR {
  token: TokenInput;
  getInfoRes?: GetInfoRes;
  getBorrowAPRRes?: GetBorrowAPRRes;
}

export type GetSupplyAPRRes = number;

export async function getSupplyAPR(
  { token, getInfoRes, getBorrowAPRRes }: GetSupplyAPR,
  config?: Services,
): Promise<GetSupplyAPRRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    if (!getBorrowAPRRes) {
      getBorrowAPRRes = await getBorrowAPR({ token }, config);
    }
    const borrowAPY = getBorrowAPRRes;

    const [environment, currentState, info] = await Promise.all([
      getEnvironment({ token }, config),
      getCurrentState({ token }, config),
      getInfo({ token }, config)
    ]);

    const scaledCollateralDenomination = tokenData[token].baseDenomination;

    const scaledTotalBorrows = new Quantity(
      currentState["total-borrows"],
      scaledCollateralDenomination,
    );
    const scaledTotalSupply = new Quantity(
      info.supply,
      scaledCollateralDenomination,
    );

    // Utilization Rate = Total Borrowed / Total Supply
    const utilizationRate = Quantity.__div(
      scaledTotalBorrows,
      scaledTotalSupply,
    ).toNumber();

    // Reserve factor in fractions
    const reserveFactorFract = Number(environment["risk-parameters"]["reserve-factor"]) / 100;

    // Apply standard Compound V2 formula:
    // Supply APY = Borrow APY × Utilization Rate × (1 - Reserve Factor)
    return borrowAPY * utilizationRate * (1 - reserveFactorFract);
  } catch (error) {
    throw new Error("Error in getSupplyAPR function: " + error);
  }
}
