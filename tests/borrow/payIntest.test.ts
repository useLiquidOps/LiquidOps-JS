import { expect, test, mock } from "bun:test";
import LiquidOps, { createDataItemSignerNode } from "../../src";

test("payInterest function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK = process.env.JWK;
  const signer = await createDataItemSignerNode(JWK);

  const client = new LiquidOps(signer);

  const res = await client.payInterest({
    poolID: LiquidOps.oTokens.wAR,
    poolTokenID: "",
    quantity: 10,
    borrowID: ""
  });

  console.log(res);

  expect(res).toBe(1);
});
