import { fetch } from "bun";
import { AoUtils } from "../../ao/utils/connect";
import { Tag } from "../../arweave/getTags";

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
    success?: ResultMatcher;
    fail?: ResultMatcher;
  };
}

const SU_ROUTER = "https://su-router.ao-testnet.xyz";

export async function trackResult(
  aoUtils: AoUtils,
  { process, message, targetProcess, match, messageTimestamp, validUntil = 1000 * 60 * 45 }: TrackResult
) {
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

  // find the final message pushed for this message on the SU
  let iterateNextPage = true;
  let cursor = messageTimestamp - 1;
  const untilTimestamp = messageTimestamp + validUntil + 1;

  while (iterateNextPage && cursor <= untilTimestamp) {
    const res: MessagesList = await (
      await fetch(
        `${SU_ROUTER}/${targetProcess || process}?from=${cursor}&to=${untilTimestamp}`
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

    }

    iterateNextPage = res.page_info.has_next_page;
  }
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
