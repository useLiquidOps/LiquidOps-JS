import { DryRun, DryRunResult, MessageInput } from "@permaweb/aoconnect/dist/lib/dryrun";
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
    let { dryrun } = connectToAO(config);
    if (LiquidOps.dryRunFifo) {
      dryrun = LiquidOps.dryRunFifo.put;
    }

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

class DryRunList {
  #list: DryRun[];
  #delay: number;
  #resolves: Array<(val: DryRun) => void>;

  constructor(list: DryRun[] = [], delay: number) {
    this.#list = list;
    this.#delay = delay;
    this.#resolves = [];
  }

  push(item: DryRun) {
    setTimeout(() => {
      const nextRequest = this.#resolves.shift();
      if (nextRequest) nextRequest(item);
      else this.#list.push(item);
    }, this.#delay);
  }

  async waitForOne() {
    const next = this.#list.shift();
    if (next) return next;

    return new Promise<DryRun>((resolve) => {
      this.#resolves.push(resolve);
    });
  }
}

export class DryRunFIFO {
  #queue: Array<{
    msg: MessageInput;
    resolve: (result: DryRunResult) => void;
    reject: (reason?: any) => void;
  }>;
  #running: boolean;
  #availableDryRuns: DryRunList;

  constructor(CUs: string[], delay = 1200) {
    this.#queue = [];
    this.#running = false;
    this.#availableDryRuns = new DryRunList(CUs.map(
      (CU_URL) => connect({ MODE: "legacy", CU_URL }).dryrun
    ), delay);
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
      const dryrun = await this.#availableDryRuns.waitForOne();
      const { msg, resolve, reject } = this.#queue.shift()!;

      try {
        const res = await dryrun(msg);
        resolve(res);
      } catch (e) {
        reject(e);
      }

      this.#availableDryRuns.push(dryrun)
    }

    this.#running = false;
  }
}
