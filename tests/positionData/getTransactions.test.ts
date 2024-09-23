import { expect, test, mock } from "bun:test";
import LiquidOps, { createDataItemSignerNode } from "../../src";

test("getTransactions function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK = process.env.JWK;
  const signer = await createDataItemSignerNode(JWK);

  const client = new LiquidOps(signer);

  const res = await client.getTransactions({
    // TODO
  });

  console.log(res);

  expect(res).toBe(1);
});
