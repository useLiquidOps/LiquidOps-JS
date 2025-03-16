import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "arbundles/node";
import { ownerToAddress } from "../../testsHelpers/arweaveUtils";

test("getTransactions function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);

  const walletAddress = await ownerToAddress(JWK.n);

  const actions = ["lend", "unLend", "borrow", "repay"] as const;

  for (const action of actions) {
    try {
      const response = await client.getTransactions({
        token: "QAR",
        action: action,
        walletAddress,
      });

      // Check response structure
      expect(response).toHaveProperty("transactions");
      expect(response).toHaveProperty("pageInfo");
      expect(response.pageInfo).toHaveProperty("hasNextPage");
      expect(typeof response.pageInfo.hasNextPage).toBe("boolean");

      if (response.pageInfo.hasNextPage) {
        expect(response.pageInfo).toHaveProperty("cursor");
        expect(typeof response.pageInfo.cursor).toBe("string");
      }

      expect(Array.isArray(response.transactions)).toBe(true);

      if (response.transactions.length > 0) {
        response.transactions.forEach((transaction) => {
          // Check basic transaction structure
          expect(transaction).toHaveProperty("id");
          expect(typeof transaction.id).toBe("string");
          expect(transaction.id.length).toBeGreaterThan(0);

          // Check tags object exists
          expect(transaction).toHaveProperty("tags");
          expect(typeof transaction.tags).toBe("object");

          // Check Protocol-Name tag
          expect(transaction.tags["Protocol-Name"]).toBe("LiquidOps");

          // Check common tag properties that should exist in all transactions
          const commonTags = [
            "Content-Type",
            "SDK",
            "Data-Protocol",
            "Variant",
            "Type",
            "Target",
          ];

          commonTags.forEach((tag) => {
            expect(transaction.tags).toHaveProperty(tag);
            expect(typeof transaction.tags[tag]).toBe("string");
          });

          // Check action-specific tags and values
          switch (action) {
            case "borrow":
              expect(transaction.tags["Action"]).toBe("Borrow");
              break;

            case "repay":
              expect(transaction.tags["Action"]).toBe("Transfer");
              expect(transaction.tags["X-Action"]).toBe("Repay");
              expect(transaction.tags["Recipient"]).toBeDefined();
              break;

            case "lend":
              expect(transaction.tags["Action"]).toBe("Transfer");
              expect(transaction.tags["X-Action"]).toBe("Mint");
              expect(transaction.tags["Recipient"]).toBeDefined();
              break;

            case "unLend":
              expect(transaction.tags["Action"]).toBe("Redeem");
              break;
          }
        });
      }
    } catch (error) {
      console.error(
        `Error testing getTransactions() with action ${action}:`,
        error,
      );
      throw error;
    }
  }
});
