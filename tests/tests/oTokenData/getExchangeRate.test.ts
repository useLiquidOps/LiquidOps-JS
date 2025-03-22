import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "../../testsHelpers/bunSigner/jwk-interface";

test("getExchangeRate function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = await client.getExchangeRate({
      token: "QAR",
    });

    expect(res).toBeTypeOf("number");
    expect(res).toBeGreaterThanOrEqual(0);
  } catch (error) {
    console.error("Error testing getExchangeRate():", error);
    throw error;
  }
});
