import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import Patching, { PatchStateoToken } from "../utils/patching";

export interface GetInfo {
  token: TokenInput;
}

export type GetInfoRes = PatchStateoToken["token-info"];

export async function getInfo(
  { token }: GetInfo,
  config?: Services,
): Promise<GetInfoRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);
    const patching = new Patching(config?.HB_NODE_URL);

    return await patching.compute(
      oTokenAddress,
      "/token-info",
      { json: true }
    );
  } catch (error) {
    throw new Error("Error in getInfo function: " + error);
  }
}
