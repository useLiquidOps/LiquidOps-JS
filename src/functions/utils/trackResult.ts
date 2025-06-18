import { Tag } from "../../arweave/getTags";
import { AoUtils, connectToAO } from "../../ao/utils/connect";
import { dryRunAwait } from "../../ao/utils/dryRunAwait";

export interface TrackResult {
  process: string;
  message: string;
  targetProcess?: string;
  messageTimestamp?: number;
  validUntil?: number;
  validateOriginal?: boolean;
  match: {
    success?: ResultMatcher;
    fail?: ResultMatcher;
  };
}

export interface TrackResultRes {
  match: "success" | "fail";
  message: PlainMessage;
}

export interface SimpleTag {
  name: string;
  value: string;
}

export interface PlainMessage {
  Anchor: string;
  Tags: SimpleTag[];
  Target: string;
  Data: string;
}

export interface ResultMatcher extends Omit<Partial<PlainMessage>, "Tags"> {
  Tags?: Tag[];
}

const SU_ROUTER = "https://su-router.ao-testnet.xyz";

export async function trackResult(
  aoUtilsInput: Pick<AoUtils, "signer" | "configs">,
  {
    process,
    message,
    targetProcess,
    match,
    messageTimestamp,
    validateOriginal = true,
    validUntil = 1000 * 60 * 45,
  }: TrackResult,
): Promise<TrackResultRes | undefined> {
  if (!process || !message) {
    throw new Error("Please specify a process and a message id");
  }
  if (!match.success && !match.fail) {
    throw new Error("Please specify an expected success/fail result match");
  }

  const aoUtils = await connectToAO(aoUtilsInput.configs);

  // check if a tag matches a result matcher
  const matchTag = (tag: SimpleTag, expected: Tag) => {
    if (tag.name !== expected.name) return false;
    if (typeof expected.values !== "string") {
      return expected.values.includes(tag.value);
    }
    return tag.value === expected.values;
  };

  // check if an expected message matches another
  const matchMsg = (msg: PlainMessage, expected: ResultMatcher) =>
    (!expected.Anchor || expected.Anchor === msg.Anchor) &&
    (!expected.Data || expected.Data === msg.Data) &&
    (!expected.Target || expected.Target === msg.Target) &&
    (!expected.Tags ||
      expected.Tags.every((tag1) =>
        msg.Tags.find((tag2) => matchTag(tag2, tag1)),
      ));

  // the returned result
  let matchedResult: TrackResultRes | undefined;

  // validate input message result
  if (validateOriginal) {
    const res = await aoUtils.result({ process, message });

    for (const msg of res.Messages as PlainMessage[]) {
      if (match.success && matchMsg(msg, match.success)) {
        matchedResult = {
          match: "success",
          message: msg,
        };
        break;
      } else if (match.fail && matchMsg(msg, match.fail)) {
        matchedResult = {
          match: "fail",
          message: msg,
        };
        break;
      }
    }
  }

  // early return if the original message produced the
  // expected result (most likely an error, in case of
  // transfer invoked messages)
  if (matchedResult) {
    return matchedResult;
  }

  // first get scheduled message data
  if (!messageTimestamp) {
    const res = await fetch(`${SU_ROUTER}/${message}?process-id=${process}`);
    if (res.status >= 400) {
      throw new Error(
        `Could not find message ${message} on process ${process}`,
      );
    }

    // parse timestamp from message data
    const messageData: ScheduledMessage = await res.json();
    messageTimestamp = parseInt(
      messageData.assignment.tags.find((tag) => tag.name === "Timestamp")
        ?.value as string,
    );

    if (!messageTimestamp || Number.isNaN(messageTimestamp)) {
      throw new Error(`Could not parse message timestamp for ${message}`);
    }
  }

  // find the final message pushed for this message on the SU
  const lookForResult = async () => {
    const resultProcess = targetProcess || process;
    const untilTimestamp = messageTimestamp + validUntil + 1;
    let iterateNextPage = true;
    let cursor = messageTimestamp - 1;

    while (!matchedResult && iterateNextPage && cursor <= untilTimestamp) {
      const res: MessagesList = await (
        await fetch(
          `${SU_ROUTER}/${resultProcess}?from=${cursor}&to=${untilTimestamp}`,
        )
      ).json();
      const potentialResultMessages: MessageOrAssignment[] = [];

      for (const interaction of res.edges) {
        const { message: msg } = interaction.node;

        // check if the iterated message was pushed for the original message.
        // if it was, we store it to read it's result later
        if (
          msg.tags.find((tag) => tag.name === "Pushed-For")?.value === message
        ) {
          potentialResultMessages.push(msg);
        }

        cursor = parseInt(interaction.cursor);
      }

      // now we read the result for all of the potential closing messages
      if (potentialResultMessages.length > 0) {
        potentialResultMessages.reverse();

        for (const generatingMsg of potentialResultMessages) {
          const msgResult = await aoUtils.result({
            process: resultProcess,
            message: generatingMsg.id,
          });

          for (const msg of msgResult.Messages as PlainMessage[]) {
            if (match.success && matchMsg(msg, match.success)) {
              matchedResult = {
                match: "success",
                message: msg,
              };
              break;
            } else if (match.fail && matchMsg(msg, match.fail)) {
              matchedResult = {
                match: "fail",
                message: msg,
              };
              break;
            }
          }

          if (matchedResult) break;
        }
      }

      iterateNextPage = res.page_info.has_next_page;
    }
  };

  // try one more time if not found
  await lookForResult();
  if (typeof matchedResult === "undefined") {
    await dryRunAwait(4);
    await lookForResult();
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
