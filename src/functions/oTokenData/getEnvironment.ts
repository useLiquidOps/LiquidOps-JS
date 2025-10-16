import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import Patching, { PatchStateoToken } from "../utils/patching";

export interface GetEnvironment {
  token: TokenInput;
}

export type GetEnvironmentRes = PatchStateoToken["environment"];

export async function getEnvironment(
  { token }: GetEnvironment,
  config?: Services,
): Promise<GetEnvironmentRes> {
  if (!token) {
    throw new Error("Please specify a token.");
  }

  const { oTokenAddress } = tokenInput(token);
  const patching = new Patching(config?.HB_NODE_URL);

  return await patching.compute(
    oTokenAddress,
    "/environment",
    { json: true }
  );
}
