import { logResult } from "./logResult";
import { aoUtils } from "..";

export async function sendMessage(
  aoUtils: aoUtils,
  processID: string,
  tags: any,
  data: string,
  action: string,
  tokenID: string,
) {
  const convertedTags = convertToArray(tags);
  convertedTags.push({ name: "Protocol-Name", value: "LiquidOps" });
  const timestamp = Date.now().toString(); // TODO: remove client timestamp use ao instead
  convertedTags.push({ name: "timestamp", value: timestamp });

  let sendMessageID;
  try {
    sendMessageID = await aoUtils.message({
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
      message: sendMessageID,
      process: processID,
    });

    await logResult(aoUtils, Error, sendMessageID, processID, action, tokenID);

    if (action === "Get-Reserve" || "Get-APY") {
      return { Messages, Spawns, Output, Error };
    }
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
