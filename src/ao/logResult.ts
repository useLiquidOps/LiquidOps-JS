import { aoUtils } from "./connect";

export async function logResult(
  aoUtils: aoUtils,
  Error: any,
  ID: string,
  processID: string,
  action: string,
  xAction: string,
  tokenID: string,
) {
  const tags = [
    { name: "resultID", value: ID },
    { name: "action", value: action },
    { name: "xAction", value: xAction },
    { name: "tokenID", value: tokenID },
  ];

  if (Error) {
    tags.push({ name: "Error", value: Error });
  } else {
    tags.push({ name: "Error", value: "false" });
  }

  try {
    await aoUtils.message({
      process: processID,
      tags: tags,
      signer: aoUtils.signer,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error logging Error");
  }
}
