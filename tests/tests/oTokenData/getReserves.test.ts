import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { GetReservesRes } from "../../../src/functions/oTokenData/getReserves";

test("getReserves function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.getReserves({
      token: "wAR",
    })) as GetReservesRes;

    expect(res).toBeTypeOf("object");
    expect(res.Action).toBe("Reserves");
    expect(res.Available).toBeTypeOf("string");
    expect(res.Lent).toBeTypeOf("string");

    expect(BigInt(res.Available)).toBeGreaterThanOrEqual(0n);
    expect(BigInt(res.Lent)).toBeGreaterThanOrEqual(0n);

    // Check if the sum of Available and Lent equals the total reserves
    const totalReserves = BigInt(res.Available) + BigInt(res.Lent);
    expect(totalReserves).toBeGreaterThanOrEqual(BigInt(res.Available));
    expect(totalReserves).toBeGreaterThanOrEqual(BigInt(res.Lent));
  } catch (error) {
    console.error("Error testing getReserves():", error);
    throw error;
  }
});
