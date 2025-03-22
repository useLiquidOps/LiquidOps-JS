import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "../../testsHelpers/bunSigner/jwk-interface";
import { GetBalancesRes } from "../../../src/functions/oTokenData/getBalances";

test("getBalances function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.getBalances({
      token: "QAR",
    })) as GetBalancesRes;

    expect(res).toBeTypeOf("object");
    expect(Object.keys(res).length).toBe(1);

    const [address, balance] = Object.entries(res)[0];

    expect(address).toBeTypeOf("string");
    expect(address.length).toBeGreaterThan(0);

    expect(typeof balance).toBe("bigint");
    expect(balance).toBeGreaterThanOrEqual(0n);
  } catch (error) {
    console.error("Error testing getBalances():", error);
    throw error;
  }
});
