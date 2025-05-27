import { dryrun } from "@permaweb/aoconnect";
import { DryRunResult } from "@permaweb/aoconnect/dist/lib/dryrun";

interface MessageTags {
  Target: string;
  Action: string;
  Quantity?: string;
  Recipient?: string;
  "X-Action"?: string;
  "borrowed-quantity"?: string;
  "borrowed-address"?: string;
  "Borrow-Id"?: string;
  "LO-Action"?: string;
  Token?: string;
  "Fill-Gaps"?: string;
  Tickers?: string;
  Owner?: string;
}

type GetDataRes = DryRunResult;

export async function getData(messageTags: MessageTags): Promise<GetDataRes> {
  const convertedMessageTags = Object.entries(messageTags).map(
    ([name, value]) => ({
      name,
      value,
    }),
  ).filter(
    t => t.name !== "Owner"
  );
  convertedMessageTags.push({ name: "Protocol-Name", value: "LiquidOps" });

  const targetProcessID = messageTags["Target"];

  try {
    const { Messages, Spawns, Output, Error } = await dryrun({
      process: targetProcessID,
      data: "",
      tags: convertedMessageTags,
      Owner: messageTags.Owner || "1234"
    });

    return {
      Messages,
      Spawns,
      Output,
      Error,
    };
  } catch (error) {
    throw new Error(`Error sending ao dryrun: ${error}`);
  }
}
