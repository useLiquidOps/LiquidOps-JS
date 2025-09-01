import { getData } from "../../ao/messaging/getData";
import { Services } from "../../ao/utils/connect";
import { tokenInput } from "../../ao/utils/tokenInput";

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

  const cooldownRes = await getData(
    {
      Target: oTokenAddress,
      Owner: recipient,
      Action: "Is-Cooldown",
    },
    config,
  );

  if (!cooldownRes?.Messages?.[0]?.Tags) {
    return { onCooldown: false };
  }

  const cooldownResTags = Object.fromEntries(
    cooldownRes.Messages[0].Tags.map((tag: { name: string; value: string }) => [
      tag.name,
      tag.value,
    ]),
  );

  if (!cooldownResTags["Is-Cooldown"]) {
    return { onCooldown: false };
  }

  const expiresOn = parseInt(cooldownResTags["Cooldown-Expires"]);

  return {
    onCooldown: true,
    expiryBlock: expiresOn,
    remainingBlocks:
      expiresOn - parseInt(cooldownResTags["Request-Block-Height"]),
  };
}
