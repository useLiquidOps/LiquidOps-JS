import {
  DryRun,
  DryRunResult,
  MessageInput,
} from "@permaweb/aoconnect/dist/lib/dryrun";
import { connectToAO, Services } from "../utils/connect";
import { dryRunAwait } from "../utils/dryRunAwait";
import { connect } from "@permaweb/aoconnect";
import LiquidOps from "../..";

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

export async function getData(
  messageTags: MessageTags,
  config?: Services,
): Promise<GetDataRes> {
  const convertedMessageTags = Object.entries(messageTags)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .filter((t) => t.name !== "Owner");
  convertedMessageTags.push({ name: "Protocol-Name", value: "LiquidOps" });

  const targetProcessID = messageTags["Target"];

  try {
    const { dryrun } = connectToAO(config);
    const msg = {
      process: targetProcessID,
      data: "",
      tags: convertedMessageTags,
      Owner: messageTags.Owner || "1234",
    };
    const { Messages, Spawns, Output, Error } = LiquidOps.dryRunFifo
      ? await LiquidOps.dryRunFifo.put(msg)
      : await dryrun(msg);

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
