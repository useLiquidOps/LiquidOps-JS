import { logResult } from "./logResult";
import { aoUtils } from "..";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

export interface SendMessageRes extends MessageResult {
  id: string;
}

export async function sendMessage(
  aoUtils: aoUtils,
  processID: string,
  messageTags: {
    [key: string]: string | number | boolean | object;
  },
  data: string,
  action: string,
  tokenID: string,
): Promise<SendMessageRes> {
  const convertedMessageTags = messageTagsToArray(messageTags);
  convertedMessageTags.push({ name: "Protocol-Name", value: "LiquidOps" });

  let id;
  try {
    id = await aoUtils.message({
      process: processID,
      tags: convertedMessageTags,
      signer: aoUtils.signer,
      data: data,
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

    await logResult(aoUtils, Error, id, processID, action, tokenID);

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
