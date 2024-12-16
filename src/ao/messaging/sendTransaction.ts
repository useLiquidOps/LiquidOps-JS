import { AoUtils } from "../utils/connect";
import { findCDTxn } from "./utils/findCDTxn";
import { Tag } from "../../arweave/getTags";
import { findCreditResult } from "./utils/findCreditResult";
import { checkTransfer } from "./utils/checkTransfer";

export interface SendTransactionRes {
  status: boolean | "pending";
  transferID: string;
  debitID?: string;
  creditID?: string;
  response?: string;
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

export async function sendTransaction(
  aoUtils: AoUtils,
  messageTags: MessageTags,
): Promise<SendTransactionRes> {
  const convertedMessageTags = Object.entries(messageTags).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );
  convertedMessageTags.push({ name: "Protocol-Name", value: "LiquidOps" });

  const targetProcessID = messageTags["Target"];

  // make transfer of tokens
  let transferID;
  try {
    transferID = await aoUtils.message({
      process: targetProcessID,
      tags: convertedMessageTags,
      signer: aoUtils.signer,
    });
  } catch (error) {
    throw new Error(`Error sending ao message for token transfer: ${error}`);
  }

  // check the transfer was true
  const transferResult = await checkTransfer(
    aoUtils,
    transferID,
    targetProcessID,
  );
  if (transferResult === "pending") {
    return {
      status: "pending",
      transferID,
      response: "Unable to find AO transfer result.",
    };
  }

  // find IDs of the action from the transfer
  let tagsToSearchFor: Tag[];
  if (messageTags["X-Action"] === "Mint") {
    tagsToSearchFor = [
      { name: "Pushed-For", values: transferID },
      { name: "From-Process", values: targetProcessID },
    ];
  } else {
    throw new Error("Send message action to search for was not found.");
  }
  const { creditID, debitID } = await findCDTxn(aoUtils, tagsToSearchFor);

  // check the result of the action from transfer was true
  const recipientID = messageTags.Recipient;
  if (!recipientID) {
    throw new Error("Cannot find recipient ID while sending transaction.");
  }
  const creditResult = await findCreditResult(aoUtils, creditID, recipientID);
  if (creditResult === "pending") {
    return {
      status: "pending",
      transferID,
      debitID,
      creditID,
      response: "Unable to find result of transaction.",
    };
  } else {
    return {
      status: true,
      transferID,
      debitID,
      creditID,
    };
  }
}
