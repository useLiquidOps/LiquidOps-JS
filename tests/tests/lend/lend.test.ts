import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { LendRes } from "../../../src/functions/lend/lend";

test("lend function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.lend({
      token: "wAR",
      quantity: 10n,
    })) as LendRes;

    expect(res).toHaveProperty("Target");
    expect(res.Target).toBeTypeOf("string");
    expect(res.Target.length).toBeGreaterThan(0);

    expect(res).toHaveProperty("Tags");
    expect(res.Tags).toHaveProperty("Action");
    expect(res.Tags.Action).toBeOneOf(["Mint-Confirmation", "Mint-Error"]);

    if (res.Tags.Action === "Mint-Confirmation") {
      if (res.Tags["Mint-Quantity"]) {
        expect(res.Tags["Mint-Quantity"]).toBeTypeOf("string");
        const mintQuantity = BigInt(res.Tags["Mint-Quantity"]);
        expect(mintQuantity).toBeGreaterThan(0n);
      } else {
        throw new Error(
          "Mint-Quantity is missing in Mint-Confirmation response",
        );
      }

      if (res.Tags["Supplied-Quantity"]) {
        expect(res.Tags["Supplied-Quantity"]).toBeTypeOf("string");
        const suppliedQuantity = BigInt(res.Tags["Supplied-Quantity"]);
        expect(suppliedQuantity).toBeGreaterThan(0n);
      } else {
        throw new Error(
          "Supplied-Quantity is missing in Mint-Confirmation response",
        );
      }

      if (res.Tags["Refund-Quantity"]) {
        expect(res.Tags["Refund-Quantity"]).toBeTypeOf("string");
        const refundQuantity = BigInt(res.Tags["Refund-Quantity"]);
        expect(refundQuantity).toBeGreaterThanOrEqual(0n);
      }
    } else if (res.Tags.Action === "Mint-Error") {
      expect(res.Tags).toHaveProperty("Error");
      expect(res.Tags.Error).toBeTypeOf("string");
    }

    if (res.Data) {
      expect(res.Data).toBeTypeOf("string");
    }
  } catch (error) {
    console.error("Error testing lend():", error);
    throw error;
  }
});
