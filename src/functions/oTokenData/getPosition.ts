import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import { Services } from "../../ao/utils/connect";
import Patching, { PatchStateoToken } from "../utils/patching";

export interface GetPosition {
  token: TokenInput;
  recipient: string;
}

export type GetPositionRes = PatchStateoToken["positions"][""];

interface Tag {
  name: string;
  value: string;
}

export async function getPosition(
  { token, recipient }: GetPosition,
  config?: Services,
): Promise<GetPositionRes> {
  try {
    if (!token || !recipient) {
      throw new Error("Please specify a token and recipient.");
    }

    const { oTokenAddress } = tokenInput(token);
    const patching = new Patching(config?.HB_NODE_URL);

    return await patching.now(
      oTokenAddress,
      `/positions/${recipient}`,
      { json: true }
    )
  } catch (error) {
    throw new Error("Error in getPosition function: " + error);
  }
}
