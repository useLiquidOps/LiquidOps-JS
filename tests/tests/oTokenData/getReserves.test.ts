import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "arbundles/node";
import { GetReservesRes } from "../../../src/functions/oTokenData/getReserves";

test("getReserves function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.getReserves({
      token: "QAR",
    })) as GetReservesRes;

    expect(res).toBeTypeOf("object");
    expect(res.available).toBeTypeOf("string");
    expect(res.lent).toBeTypeOf("string");

    expect(BigInt(res.available)).toBeGreaterThanOrEqual(0n);
    expect(BigInt(res.lent)).toBeGreaterThanOrEqual(0n);

    // Check if the sum of available and lent equals the total reserves
    const totalReserves = BigInt(res.available) + BigInt(res.lent);
    expect(totalReserves).toBeGreaterThanOrEqual(BigInt(res.available));
    expect(totalReserves).toBeGreaterThanOrEqual(BigInt(res.lent));
  } catch (error) {
    console.error("Error testing getReserves():", error);
    throw error;
  }
});
