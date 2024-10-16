import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { BorrowRes } from "../../../src/functions/borrow/borrow";

test("borrow function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = await client.borrow({
      token: "wAR",
      quantity: 10n,
    }) as BorrowRes;

    expect(res).toHaveProperty("Target");
    expect(res.Target).toBeTypeOf("string");
    expect(res.Target.length).toBeGreaterThan(0);

    expect(res).toHaveProperty("Tags");
    expect(res.Tags).toHaveProperty("Action");
    expect(res.Tags.Action).toBeOneOf(["Borrow-Confirmation", "Borrow-Error"]);

    if (res.Tags.Action === "Borrow-Confirmation") {
      expect(res.Tags).toHaveProperty("Borrowed-Quantity");
      if (res.Tags["Borrowed-Quantity"]) {
        expect(res.Tags["Borrowed-Quantity"]).toBeTypeOf("string");
        const borrowedQuantity = BigInt(res.Tags["Borrowed-Quantity"]);
        expect(borrowedQuantity).toBeGreaterThan(0n);
      } else {
        throw new Error("Borrowed-Quantity is missing in Borrow-Confirmation response");
      }
    }

    if (res.Data) {
      expect(res.Data).toBeTypeOf("string");
    }
  } catch (error) {
    console.error("Error testing borrow():", error);
    throw error;
  }
});