import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { TransferRes } from "../../../src/functions/utils/transfer";

test("transfer function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.transfer({
      token: "wAR",
      recipient: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
      quantity: 10n,
    })) as TransferRes;

    expect(res).toBeTypeOf("object");
    expect(res.Target).toBeTypeOf("string");
    expect(res.Target.length).toBeGreaterThan(0);

    expect(res.Tags).toBeTypeOf("object");
    expect(res.Tags.Action).toBeOneOf(["Debit-Notice", "Transfer-Error"]);

    if (res.Tags.Action === "Debit-Notice") {
      expect(res.Tags.Recipient).toBe(
        "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
      );
      expect(res.Tags.Quantity).toBe("10");
      expect(res.Tags["Message-Id"]).toBeTypeOf("string");
    } else if (res.Tags.Action === "Transfer-Error") {
      expect(res.Tags.Error).toBeTypeOf("string");
    }
  } catch (error) {
    console.error("Error testing transfer():", error);
    throw error;
  }
});
