import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { ownerToAddress } from "../../testsHelpers/arweaveUtils";

test("getTransactions function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  const walletAddress = await ownerToAddress(JWK.n);

  const actions = [
    "all",
    "borrow",
    "payInterest",
    "repay",
    "lend",
    "unLend",
    "transfer",
  ] as const;

  for (const action of actions) {
    try {
      const res = await client.getTransactions({
        token: "wAR",
        action: action,
        walletAddress,
      });

      expect(res).toHaveProperty("edges");
      expect(Array.isArray(res.edges)).toBe(true);

      if (res.edges.length > 0) {
        res.edges.forEach((edge) => {
          expect(edge).toHaveProperty("node");
          const transaction = edge.node;

          expect(transaction).toHaveProperty("id");
          expect(transaction.id).toBeTypeOf("string");
          expect(transaction.id.length).toBeGreaterThan(0);

          expect(transaction).toHaveProperty("tags");
          expect(Array.isArray(transaction.tags)).toBe(true);
          expect(transaction.tags.length).toBeGreaterThan(0);

          const protocolNameTag = transaction.tags.find(
            (tag) => tag.name === "Protocol-Name",
          );
          expect(protocolNameTag).toBeDefined();
          expect(protocolNameTag?.value).toBe("LiquidOps");

          if (action !== "all") {
            const actionTag = transaction.tags.find((tag) => {
              if (action === "unLend")
                return tag.name === "Action" && tag.value === "Burn";
              if (action === "transfer")
                return tag.name === "LO-Action" && tag.value === "Transfer";
              return (
                tag.name === "X-Action" &&
                tag.value === action.charAt(0).toUpperCase() + action.slice(1)
              );
            });
            expect(actionTag).toBeDefined();
          }

          transaction.tags.forEach((tag) => {
            expect(tag).toHaveProperty("name");
            expect(tag.name).toBeTypeOf("string");
            expect(tag.name.length).toBeGreaterThan(0);

            expect(tag).toHaveProperty("value");
            expect(tag.value).toBeTypeOf("string");
          });
        });
      }

      expect(res).toHaveProperty("pageInfo");
      expect(res.pageInfo).toHaveProperty("hasNextPage");
    } catch (error) {
      console.error(
        `Error testing getTransactions() with action ${action}:`,
        error,
      );
      throw error;
    }
  }
});
