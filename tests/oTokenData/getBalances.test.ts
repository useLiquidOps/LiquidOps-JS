import { expect, test } from "bun:test";
import LiquidOps, { createDataItemSignerNode } from "../../src";

test("getBalances function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK = process.env.JWK;
  const signer = await createDataItemSignerNode(JWK);

  const client = new LiquidOps(signer);

  const res = await client.getBalances({
    token: 'wAR'
  });

  expect(res).toBe(1); // TODO
});
