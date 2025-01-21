import { AoUtils } from "../utils/connect";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

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

interface GetDataRes extends MessageResult {
  initialMessageID: string;
}

export async function getData(
  aoUtils: AoUtils,
  messageTags: MessageTags,
): Promise<GetDataRes> {
  const convertedMessageTags = Object.entries(messageTags).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );
  convertedMessageTags.push({ name: "Protocol-Name", value: "LiquidOps" });

  const targetProcessID = messageTags["Target"];

  let messageID;
  try {
    messageID = await aoUtils.message({
      process: targetProcessID,
      tags: convertedMessageTags,
      signer: aoUtils.signer,
    });
  } catch (error) {
    throw new Error(`Error sending ao message: ${error}`);
  }

  try {
    const { Messages, Spawns, Output, Error } = await aoUtils.result({
      message: messageID,
      process: targetProcessID,
    });

    return {
      Messages,
      Spawns,
      Output,
      Error,
      initialMessageID: messageID,
    };
  } catch (error) {
    throw new Error(`Error reading ao message result: ${error}`);
  }
}
