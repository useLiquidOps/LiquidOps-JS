import { AoUtils } from "./connect";
import { MessageResult as AoMessageResult } from "@permaweb/aoconnect/dist/lib/result";

export type MessageResult = AoMessageResult; // needed for jest tests

export interface SendMessageRes extends MessageResult {
  id: string;
}

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
}

export async function sendMessage(
  aoUtils: AoUtils,
  messageTags: MessageTags,
): Promise<SendMessageRes> {
  const convertedMessageTags = messageTagsToArray(messageTags);
  convertedMessageTags.push({ name: "Protocol-Name", value: "LiquidOps" });

  const processID = messageTags["Target"];

  let id;
  try {
    id = await aoUtils.message({
      process: processID,
      tags: convertedMessageTags,
      signer: aoUtils.signer,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error sending ao message");
  }

  try {
    const { Messages, Spawns, Output, Error } = await aoUtils.result({
      message: id,
      process: processID,
    });

    return { id, Messages, Spawns, Output, Error };
  } catch (error) {
    console.log(error);
    throw new Error("Error reading ao message result");
  }
}

function messageTagsToArray(obj: any): any {
  return Object.entries(obj).map(([name, value]) => ({
    name,
    value,
  }));
}
