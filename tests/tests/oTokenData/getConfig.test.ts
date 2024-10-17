import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { GetConfigRes } from "../../../src/functions/oTokenData/getConfig";

test("getConfig function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.getConfig({
      token: "wAR",
    })) as GetConfigRes;

    expect(res).toBeTypeOf("object");
    expect(res.Action).toBe("Config");
    expect(res.Token).toBeTypeOf("string");
    expect(res["Collateral-Ratio"]).toBeTypeOf("number");
    expect(res["Liquidation-Threshold"]).toBeTypeOf("number");
    expect(res.Oracle).toBeTypeOf("string");
    expect(res["Collateral-Denomination"]).toBeTypeOf("string");

    expect(res["Collateral-Ratio"]).toBeGreaterThan(0);
    expect(res["Liquidation-Threshold"]).toBeGreaterThan(0);
    expect(res["Liquidation-Threshold"]).toBeLessThanOrEqual(
      res["Collateral-Ratio"],
    );
    expect(res.Oracle.length).toBeGreaterThan(0);
    expect(res["Collateral-Denomination"].length).toBeGreaterThan(0);
  } catch (error) {
    console.error("Error testing getConfig():", error);
    throw error;
  }
});
