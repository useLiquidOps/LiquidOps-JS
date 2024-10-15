import { expect, test } from "bun:test";
import LiquidOps, { createDataItemSignerNode } from "../../src";
import { JWKInterface } from "arbundles/node";

test("transfer function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = await createDataItemSignerNode(JWK);

  const client = new LiquidOps(signer);

  const res = await client.transfer({
    tokenAddress: LiquidOps.tokens.wAR, // Make it typed names?
    recipient: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
    quantity: BigInt(10),
  });

  expect(res).toBe(1); // TODO
});
