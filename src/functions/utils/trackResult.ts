import { result } from "@permaweb/aoconnect/browser";
import { Tag } from "../../arweave/getTags";
import { fetch } from "bun";

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

export async function trackResult({
  process,
  message,
  targetProcess,
  match,
  messageTimestamp,
  validUntil = 1000 * 60 * 45
}: TrackResult): Promise<TrackResultRes | undefined> {
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

  // let cursor = messageTimestamp - 1;
  // const untilTimestamp = messageTimestamp + validUntil + 1;

  // let matchedResult: PlainMessage | undefined;

  // while (!matchedResult && cursor <= untilTimestamp) {
  //   const res = await aoUtils.results({
  //     process: targetProcess || process,
  //     from: cursor.toString(),
  //     to: untilTimestamp.toString(),
  //     sort: "DESC",
  //     limit: 50
  //   });

  //   for (const result of res.edges) {
  //     cursor = result.cursor;
  //     matchedResult = (result.node.Messages as PlainMessage[]).find(
  //       (msg) => (match.success && matchMsg(msg, match.success)) ||
  //         (match.fail && matchMsg(msg, match.fail))
  //     );
  //   }
  // }

  // find the final message pushed for this message on the SU
  const resultProcess = targetProcess || process;
  const untilTimestamp = messageTimestamp + validUntil + 1;

  let iterateNextPage = true;
  let cursor = messageTimestamp - 1;

  let matchedResult: TrackResultRes | undefined;

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
