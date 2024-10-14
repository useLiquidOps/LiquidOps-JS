import { logResult } from "./logResult";
import { aoUtils } from "..";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

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
}

export async function sendMessage(
  aoUtils: aoUtils,
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

    const action = messageTags["Action"];
    const xAction = messageTags["X-Action"] || "";

    await logResult(aoUtils, Error, id, processID, action, xAction, processID);

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
