import { message, createDataItemSigner } from "@permaweb/aoconnect";

export async function logResult(
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
    await message({
      process: processID,
      tags: tags,
      // TODO: remove
      // @ts-ignore (Add wallet kit later)
      signer: createDataItemSigner(window.arweaveWallet),
      data: "",
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error logging Error");
  }
}
