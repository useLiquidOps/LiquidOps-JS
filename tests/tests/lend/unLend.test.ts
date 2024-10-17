import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { UnLendRes } from "../../../src/functions/lend/unLend";

test("unLend function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.unLend({
      token: "wAR",
      quantity: 10n,
    })) as UnLendRes;

    expect(res).toHaveProperty("Target");
    expect(res.Target).toBeTypeOf("string");
    expect(res.Target.length).toBeGreaterThan(0);

    expect(res).toHaveProperty("Tags");
    expect(res.Tags).toHaveProperty("Action");
    expect(res.Tags.Action).toBeOneOf(["Redeem-Confirmation", "Redeem-Error"]);

    if (res.Tags.Action === "Redeem-Confirmation") {
      if (res.Tags["Earned-Quantity"]) {
        expect(res.Tags["Earned-Quantity"]).toBeTypeOf("string");
        const earnedQuantity = BigInt(res.Tags["Earned-Quantity"]);
        expect(earnedQuantity).toBeGreaterThanOrEqual(0n);
      }

      if (res.Tags["Burned-Quantity"]) {
        expect(res.Tags["Burned-Quantity"]).toBeTypeOf("string");
        const burnedQuantity = BigInt(res.Tags["Burned-Quantity"]);
        expect(burnedQuantity).toBeGreaterThan(0n);
      } else {
        throw new Error(
          "Burned-Quantity is missing in Redeem-Confirmation response",
        );
      }

      if (res.Tags["Refund-Quantity"]) {
        expect(res.Tags["Refund-Quantity"]).toBeTypeOf("string");
        const refundQuantity = BigInt(res.Tags["Refund-Quantity"]);
        expect(refundQuantity).toBeGreaterThanOrEqual(0n);
      }
    } else if (res.Tags.Action === "Redeem-Error") {
      expect(res.Tags).toHaveProperty("Error");
      expect(res.Tags.Error).toBeTypeOf("string");
    }

    if (res.Data) {
      expect(res.Data).toBeTypeOf("string");
    }
  } catch (error) {
    console.error("Error testing unLend():", error);
    throw error;
  }
});
