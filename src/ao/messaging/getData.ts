import { DryRunResult, MessageInput } from "@permaweb/aoconnect/dist/lib/dryrun";
import { connectToAO, Services } from "../utils/connect";
import { dryrun } from "@permaweb/aoconnect/browser";
import { dryRunAwait } from "../utils/dryRunAwait";

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
    const { Messages, Spawns, Output, Error } = await dryrun({
      process: targetProcessID,
      data: "",
      tags: convertedMessageTags,
      Owner: messageTags.Owner || "1234",
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

export class DryRunFIFO {
  #queue: {
    msg: MessageInput;
    resolve: (result: DryRunResult) => void;
    reject: (reason?: any) => void;
  }[];
  #delay: number;
  #running: boolean;

  constructor(delay = 1200) {
    this.#queue = [];
    this.#delay = delay;
    this.#running = false;
  }

  put(msg: MessageInput) {
    return new Promise<DryRunResult>((resolve, reject) => {
      this.#queue.push({ msg, resolve, reject });
      this.#run();
    });
  }

  async #run() {
    if (this.#running) return;
    this.#running = true;

    while (this.#queue.length > 0) {
      const { msg, resolve, reject } = this.#queue.shift()!;

      try {
        const res = await dryrun(msg);
        resolve(res);
      } catch (e) {
        reject(e);
      }

      if (this.#queue.length > 0) {
        await dryRunAwait(this.#delay);
      }
    }

    this.#running = false;
  }
}
