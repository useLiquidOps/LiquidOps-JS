import { message, createDataItemSigner, result } from "@permaweb/aoconnect";
import { logResult } from "./logResult";

export async function sendMessage(
  processID: string,
  tags: any,
  data: string,
  action: string,
  tokenID: string,
) {
  const convertedTags = convertToArray(tags);
  convertedTags.push({ name: "Protocol-Name", value: "Name" });
  const timestamp = Date.now().toString();
  convertedTags.push({ name: "timestamp", value: timestamp });

  let sendMessageID;
  try {
    sendMessageID = await message({
      process: processID,
      tags: convertedTags,
      // TODO: remove
      // @ts-ignore (Add wallet kit later)
      signer: createDataItemSigner(window.arweaveWallet),
      data: data,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error sending ao message");
  }

  try {
    const { Messages, Spawns, Output, Error } = await result({
      message: sendMessageID,
      process: processID,
    });

    await logResult(Error, sendMessageID, processID, action, tokenID);

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
