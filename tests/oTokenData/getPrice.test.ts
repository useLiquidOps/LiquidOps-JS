import { expect, test } from "bun:test";
import LiquidOps, { createDataItemSignerNode } from "../../src";
import { JWKInterface } from "arbundles/node";

test("getPrice function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = await createDataItemSignerNode(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = await client.getPrice({
      token: "wAR",
      quantity: BigInt(10),
    });

    expect(res).toBeTypeOf("number");
    expect(res).toBeGreaterThan(0);
    expect(Number.isFinite(res)).toBe(true);

  } catch (error) {
    console.error("Error testing getPrice():", error);
    throw error;
  }
});