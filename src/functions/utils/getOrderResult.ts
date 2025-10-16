import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import Patching, { PatchStateoToken } from "../utils/patching";

export interface GetOrderResult {
  token: TokenInput;
  /** The order ID is the initiating message ID (pushed-for tag value) */
  orderId: string;
}

export type GetOrderResultRes = PatchStateoToken["orders"][""];

export async function getOrderResult(
  { token, orderId }: GetOrderResult,
  config?: Services,
): Promise<GetOrderResultRes | undefined> {
  if (!token || !orderId) {
    throw new Error("Please specify a token and an order ID.");
  }

  const { oTokenAddress } = tokenInput(token);
  const patching = new Patching(config?.HB_NODE_URL);

  return await patching.now(
    oTokenAddress,
    `/orders/${orderId}`,
    { json: true }
  );
}
