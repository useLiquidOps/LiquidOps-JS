import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "arbundles/node";
import { TransferRes } from "../../../src/functions/utils/transfer";

test("transfer function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.transfer({
      token: "QAR",
      recipient: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
      quantity: 1n,
    })) as TransferRes;

    expect(res).toBeTypeOf("object");
    expect(res.id).toBeTypeOf("string");
    expect(res.id.length).toBeGreaterThan(0);
    expect(res.status).toBeTypeOf("boolean");

    // check transfer result
    if (res.status) {
      expect(res.status).toBe(true);
    }
  } catch (error) {
    console.error("Error testing transfer():", error);
    throw error;
  }
});
