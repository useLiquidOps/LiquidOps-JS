import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";

test("getAPR function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = await client.getAPR({
      token: "wAR",
    });

    expect(res).toBeTypeOf("number");
    expect(res).toBeGreaterThanOrEqual(0);
    expect(res).toBeLessThanOrEqual(100);
  } catch (error) {
    console.error("Error testing getAPR():", error);
    throw error;
  }
});
