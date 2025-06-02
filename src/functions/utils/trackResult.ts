import { result } from "@permaweb/aoconnect/browser";
import { Tag } from "../../arweave/getTags";
import { AoUtils } from "../../ao/utils/connect";

export interface ResultMatcher {
  id?: string;
  from?: string;
  tags?: Tag[];
}

export interface TrackResult {
  process: string;
  message: string;
  targetProcess?: string;
  messageTimestamp?: number;
  validUntil?: number;
  strategy?: "precise" | "fast";
  match: {
    success?: Partial<PlainMessage>;
    fail?: Partial<PlainMessage>;
  };
}

export interface TrackResultRes {
  match: "success" | "fail";
  message: PlainMessage;
}

export interface PlainMessage {
  Anchor: string;
  Tags: {
    name: string;
    value: string;
  }[];
  Target: string;
  Data: string;
}

const SU_ROUTER = "https://su-router.ao-testnet.xyz";

export async function trackResult(
  aoUtils: AoUtils,
  {
    process,
    message,
    targetProcess,
    match,
    messageTimestamp,
    strategy = "precise",
    validUntil = 1000 * 60 * 45
  }: TrackResult
): Promise<TrackResultRes | undefined> {
  if (!process || !message) {
    throw new Error("Please specify a process and a message id");
  }
  if (!match.success && !match.fail) {
    throw new Error("Please specify an expected success/fail result match");
  }

  // first get scheduled message data
  if (!messageTimestamp) {
    const res = await fetch(`${SU_ROUTER}/${message}?process-id=${process}`);
    if (res.status >= 400) {
      throw new Error(`Could not find message ${message} on process ${process}`);
    }

    // parse timestamp from message data
    const messageData: ScheduledMessage = await res.json();
    messageTimestamp = parseInt(messageData.assignment.tags.find(
      (tag) => tag.name === "Timestamp"
    )?.value as string);

    if (!messageTimestamp || Number.isNaN(messageTimestamp)) {
      throw new Error(`Could not parse message timestamp for ${message}`);
    }
  }

  // check if an expected message matches another
  const matchMsg = (msg: PlainMessage, expected: Partial<PlainMessage>) =>
    (!expected.Anchor || expected.Anchor === msg.Anchor) &&
    (!expected.Data || expected.Data === msg.Data) &&
    (!expected.Target || expected.Target === msg.Target) &&
    (!expected.Tags || expected.Tags
      .every((tag1) => msg.Tags.find(
        (tag2) => tag2.name === tag1.name && tag2.value === tag1.value)
      )
    );

  // find the final message pushed for this message on the SU
  const resultProcess = targetProcess || process;

  let matchedResult: TrackResultRes | undefined;
  let iterateNextPage = true;

  if (strategy === "fast") {
    let cursor: string | undefined;

    while (!matchedResult && iterateNextPage) {
      const res = await aoUtils.results({
        process: targetProcess || process,
        from: cursor,
        sort: "DESC",
        limit: 50
      });

      for (const result of res.edges) {
        cursor = result.cursor;

        for (const msg of result.node.Messages as PlainMessage[]) {
          if (match.success && matchMsg(msg, match.success)) {
            matchedResult = {
              match: "success",
              message: msg
            };
            break;
          } else if (match.fail && matchMsg(msg, match.fail)) {
            matchedResult = {
              match: "fail",
              message: msg
            };
            break;
          }
        }

        if (matchedResult) break;
      }

      iterateNextPage = res.pageInfo.hasNextPage;
    }
  } else {
    const untilTimestamp = messageTimestamp + validUntil + 1;
    let cursor = messageTimestamp - 1;

    while (!matchedResult && iterateNextPage && cursor <= untilTimestamp) {
      const res: MessagesList = await (
        await fetch(
          `${SU_ROUTER}/${resultProcess}?from=${cursor}&to=${untilTimestamp}`
        )
      ).json();
      const potentialResultMessages: MessageOrAssignment[] = [];

      for (const interaction of res.edges) {
        const { message: msg } = interaction.node;

        // check if the iterated message was pushed for the original message.
        // if it was, we store it to read it's result later
        if (msg.tags.find((tag) => tag.name === "Pushed-For")?.value === message) {
          potentialResultMessages.push(msg);
        }

        cursor = parseInt(interaction.cursor);
      }

      // now we read the result for all of the potential closing messages
      if (potentialResultMessages.length > 0) {
        potentialResultMessages.reverse();

        for (const generatingMsg of potentialResultMessages) {
          const msgResult = await result({
            process: resultProcess,
            message: generatingMsg.id
          });

          for (const msg of msgResult.Messages as PlainMessage[]) {
            if (match.success && matchMsg(msg, match.success)) {
              matchedResult = {
                match: "success",
                message: msg
              };
              break;
            } else if (match.fail && matchMsg(msg, match.fail)) {
              matchedResult = {
                match: "fail",
                message: msg
              };
              break;
            }
          }

          if (matchedResult) break;
        }
      }

      iterateNextPage = res.page_info.has_next_page;
    }
  }

  return matchedResult;
}

interface MessageOrAssignment {
  id: string;
  owner: {
    address: string;
    key: string;
  };
  data: string;
  tags: {
    name: string;
    value: string;
  }[];
  signature: string;
  target?: string | "";
  anchor?: string;
}

interface ScheduledMessage {
  message: MessageOrAssignment;
  assignment: MessageOrAssignment;
}

interface MessagesList {
  page_info: {
    has_next_page: false;
  };
  edges: {
    node: {
      message: MessageOrAssignment;
      assignment: MessageOrAssignment;
    };
    cursor: string;
  }[];
}
