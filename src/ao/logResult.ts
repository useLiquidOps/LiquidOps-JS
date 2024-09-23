import { aoUtils } from "..";

export async function logResult(
  aoUtils: aoUtils,
  Error: any,
  ID: string,
  processID: string,
  action: string,
  tokenID: string,
) {
  const tags = [
    { name: "resultID", value: ID },
    { name: "action", value: action },
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
      data: "",
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error logging Error");
  }
}
