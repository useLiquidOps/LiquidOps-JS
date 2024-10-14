import { expect, test } from "bun:test";
import LiquidOps, { createDataItemSignerNode } from "../../src";

test("transfer function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK = process.env.JWK;
  const signer = await createDataItemSignerNode(JWK);

  const client = new LiquidOps(signer);

  const res = await client.transfer({
    tokenAddress: LiquidOps.tokens.wAR,
    recipient: '',
    quantity: BigInt(10)
  });

  expect(res).toBe(1); // TODO
});
