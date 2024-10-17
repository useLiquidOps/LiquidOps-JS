import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";

test("getPrice function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = await client.getPrice({
      token: "wAR",
      quantity: 10n,
    });

    expect(typeof res).toBe("bigint");
    expect(res).toBeGreaterThan(0n);
  } catch (error) {
    console.error("Error testing getPrice():", error);
    throw error;
  }
});
