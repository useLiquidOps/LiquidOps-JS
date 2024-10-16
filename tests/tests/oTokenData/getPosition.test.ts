import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { GetPositionRes } from "../../../src/functions/oTokenData/getPosition";

test("getPosition function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = await client.getPosition({
      token: "wAR",
      recipient: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
    }) as GetPositionRes;

    expect(res).toBeTypeOf("object");
    expect(res.Capacity).toBeTypeOf("string");
    expect(res["Used-Capacity"]).toBeTypeOf("string");
    expect(res["Collateral-Ticker"]).toBeTypeOf("string");

    expect(BigInt(res.Capacity)).toBeGreaterThanOrEqual(0n);
    expect(BigInt(res["Used-Capacity"])).toBeGreaterThanOrEqual(0n);
    expect(BigInt(res["Used-Capacity"])).toBeLessThanOrEqual(BigInt(res.Capacity));
    expect(res["Collateral-Ticker"].length).toBeGreaterThan(0);
  } catch (error) {
    console.error("Error testing getPosition():", error);
    throw error;
  }
});

