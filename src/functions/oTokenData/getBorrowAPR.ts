import { getData } from "../../ao/messaging/getData";
import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetBorrowAPR {
  token: TokenInput;
}

export type GetBorrowAPRRes = number;

export async function getBorrowAPR(
  { token }: GetBorrowAPR,
  config?: Services,
): Promise<GetBorrowAPRRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);
    const res = await (
      await fetch(`${config?.HB_NODE_URL}/${oTokenAddress}~process@1.0/compute/pool-state/rates/borrow`)
    ).text();

    return parseFloat(res);
  } catch (error) {
    throw new Error("Error in getBorrowAPR function: " + error);
  }
}
