import { Services } from "../../ao/utils/connect";
import { tokenInput } from "../../ao/utils/tokenInput";
import Patching from "../utils/patching";

export interface GetCooldown {
  recipient: string;
  token: string;
}

export type GetCooldownRes =
  | { onCooldown: false }
  | {
      onCooldown: true;
      expiryBlock: number;
      remainingBlocks: number;
    };

export async function getCooldown(
  { recipient, token }: GetCooldown,
  config?: Services,
): Promise<GetCooldownRes> {
  if (!recipient) throw new Error("Please specify a recipient");
  if (!token) throw new Error("Please specify a token address");

  const { oTokenAddress } = tokenInput(token);
  const patching = new Patching(config?.HB_NODE_URL);

  const cooldownRes = await patching.now(
    oTokenAddress,
    `/cooldowns/${recipient}`
  );

  if (!cooldownRes || cooldownRes == "") {
    return { onCooldown: false };
  }

  const networkInfo = await (
    await fetch(`${config?.GATEWAY_URL || "https://arweave.net"}/info`)
  ).json();
  const currentBlock = networkInfo?.height || 0;
  const expiryBlock = parseInt(cooldownRes);

  if (expiryBlock <= currentBlock) {
    return { onCooldown: false };
  }

  return {
    onCooldown: true,
    expiryBlock,
    remainingBlocks: expiryBlock - currentBlock,
  };
}
