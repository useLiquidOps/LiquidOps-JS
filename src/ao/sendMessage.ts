import { logResult } from "./logResult";
import { aoUtils } from "..";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

export interface SendMessageRes extends MessageResult {
  id: string;
}

export async function sendMessage(
  aoUtils: aoUtils,
  processID: string,
  tags: any,
  data: string,
  action: string,
  tokenID: string,
): Promise<SendMessageRes> {
  const convertedTags = convertToArray(tags);
  convertedTags.push({ name: "Protocol-Name", value: "LiquidOps" });

  let id;
  try {
    id = await aoUtils.message({
      process: processID,
      tags: convertedTags,
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

function convertToArray(obj: any): any {
  return Object.entries(obj).map(([name, value]) => ({
    name,
    value,
  }));
}
