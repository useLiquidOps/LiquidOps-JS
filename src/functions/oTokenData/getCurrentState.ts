import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import Patching, { PatchStateoToken } from "../utils/patching";

export interface GetCurrentState {
  token: TokenInput;
}

export type GetCurrentStateRes = PatchStateoToken["pool-state"];

export async function getCurrentState(
  { token }: GetCurrentState,
  config?: Services,
): Promise<GetCurrentStateRes> {
  if (!token) {
    throw new Error("Please specify a token.");
  }

  const { oTokenAddress } = tokenInput(token);
  const patching = new Patching(config?.HB_NODE_URL);

  return await patching.now(
    oTokenAddress,
    "/pool-state",
    { json: true }
  );
}
