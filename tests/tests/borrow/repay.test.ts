import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { RepayRes } from "../../../src/functions/borrow/repay";

test("repay function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = await client.repay({
      token: "wAR",
      quantity: 10n,
    }) as RepayRes;

    expect(res).toHaveProperty("Target");
    expect(res.Target).toBeTypeOf("string");
    expect(res.Target.length).toBeGreaterThan(0);

    expect(res).toHaveProperty("Tags");
    expect(res.Tags).toHaveProperty("Action");
    expect(res.Tags.Action).toBeOneOf(["Repay-Confirmation", "Repay-Error"]);

    if (res.Tags.Action === "Repay-Confirmation") {
      if (res.Tags["Repaid-Quantity"]) {
        expect(res.Tags["Repaid-Quantity"]).toBeTypeOf("string");
        const repaidQuantity = BigInt(res.Tags["Repaid-Quantity"]);
        expect(repaidQuantity).toBeGreaterThan(0n);
      } else {
        throw new Error("Repaid-Quantity is missing in Repay-Confirmation response");
      }

      if (res.Tags["Refund-Quantity"]) {
        expect(res.Tags["Refund-Quantity"]).toBeTypeOf("string");
        const refundQuantity = BigInt(res.Tags["Refund-Quantity"]);
        expect(refundQuantity).toBeGreaterThanOrEqual(0n);
      }
    } else if (res.Tags.Action === "Repay-Error") {
      expect(res.Tags).toHaveProperty("Error");
      expect(res.Tags.Error).toBeTypeOf("string");
    }

    if (res.Data) {
      expect(res.Data).toBeTypeOf("string");
    }
  } catch (error) {
    console.error("Error testing repay():", error);
    throw error;
  }
});