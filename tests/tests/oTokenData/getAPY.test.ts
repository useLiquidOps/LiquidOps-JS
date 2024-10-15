import { expect, test } from "bun:test";
import LiquidOps, { createDataItemSignerNode } from "../../src";
import { JWKInterface } from "arbundles/node";

test("getAPY function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = await createDataItemSignerNode(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = await client.getAPY({
      token: "wAR",
    });

    expect(res).toBeTypeOf("number");
    expect(res).toBeGreaterThanOrEqual(0);
    expect(res).toBeLessThanOrEqual(100);

  } catch (error) {
    console.error("Error testing getAPY():", error);
    throw error;
  }
});