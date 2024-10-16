import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { ownerToAddress } from "../../testsHelpers/arweaveUtils";
import { Transaction } from "../../../src/arweave/getTags";

test("getTransactions function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  const walletAddress = await ownerToAddress(JWK.n);

  try {
    const res = await client.getTransactions({
      token: "wAR",
      action: "lend",
      walletAddress,
    });

    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThan(0);

    res.forEach((item, index) => {
      expect(item).toHaveProperty("node");
      const transaction: Transaction = item.node;

      expect(transaction).toHaveProperty("id");
      expect(transaction.id).toBeTypeOf("string");
      expect(transaction.id.length).toBeGreaterThan(0);

      expect(transaction).toHaveProperty("tags");
      expect(Array.isArray(transaction.tags)).toBe(true);
      expect(transaction.tags.length).toBeGreaterThan(0);

      transaction.tags.forEach((tag, tagIndex) => {
        expect(tag).toHaveProperty("name");
        expect(tag.name).toBeTypeOf("string");
        expect(tag.name.length).toBeGreaterThan(0);

        expect(tag).toHaveProperty("value");
        expect(tag.value).toBeTypeOf("string");
      });
    });
  } catch (error) {
    console.error("Error testing getTransactions():", error);
    throw error;
  }
});
