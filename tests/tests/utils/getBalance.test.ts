import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { ownerToAddress } from "../../testsHelpers/arweaveUtils";

test("getBalance function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  const walletAddress = await ownerToAddress(JWK.n);

  try {
    const res = await client.getBalance({
      token: "wAR",
      walletAddress,
    });

    expect(typeof res).toBe("bigint");
    expect(res).toBeGreaterThanOrEqual(0n);
  } catch (error) {
    console.error("Error testing getBalance():", error);
    throw error;
  }
});
