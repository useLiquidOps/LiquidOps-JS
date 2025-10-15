import { getData } from "../../ao/messaging/getData";
import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import Patching from "../utils/patching";

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

    const patching = new Patching(config?.HB_NODE_URL);
    const { oTokenAddress } = tokenInput(token);
    const res = await patching.now(
      oTokenAddress,
      "/pool-state/rates",
      { json: true }
    );

    return parseFloat(res.borrow);
  } catch (error) {
    throw new Error("Error in getBorrowAPR function: " + error);
  }
}
