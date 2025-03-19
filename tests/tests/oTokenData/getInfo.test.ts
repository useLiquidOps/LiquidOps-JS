import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "../../testsHelpers/bunSigner/jwk-interface";
import { GetInfoRes } from "../../../src/functions/oTokenData/getInfo";

test("getInfo function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.getInfo({
      token: "QAR",
    })) as GetInfoRes;

    expect(res).toBeTypeOf("object");
    expect(res.name).toBeTypeOf("string");
    expect(res.ticker).toBeTypeOf("string");
    expect(res.logo).toBeTypeOf("string");
    expect(res.denomination).toBeTypeOf("string");

    expect(res.name.length).toBeGreaterThan(0);
    expect(res.ticker.length).toBeGreaterThan(0);
    expect(res.logo.length).toBeGreaterThan(0);
    expect(res.denomination.length).toBeGreaterThan(0);
  } catch (error) {
    console.error("Error testing getInfo():", error);
    throw error;
  }
});
