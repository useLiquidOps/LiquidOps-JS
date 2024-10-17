import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { GetInfoRes } from "../../../src/functions/oTokenData/getInfo";

test("getInfo function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.getInfo({
      token: "wAR",
    })) as GetInfoRes;

    expect(res).toBeTypeOf("object");
    expect(res.Name).toBeTypeOf("string");
    expect(res.Ticker).toBeTypeOf("string");
    expect(res.Logo).toBeTypeOf("string");
    expect(res.Denomination).toBeTypeOf("string");

    expect(res.Name.length).toBeGreaterThan(0);
    expect(res.Ticker.length).toBeGreaterThan(0);
    expect(res.Logo.length).toBeGreaterThan(0);
    expect(res.Denomination.length).toBeGreaterThan(0);

    expect(() => new URL(res.Logo)).not.toThrow();
  } catch (error) {
    console.error("Error testing getInfo():", error);
    throw error;
  }
});
