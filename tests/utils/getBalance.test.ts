import { expect, test } from "bun:test";
import LiquidOps, { createDataItemSignerNode } from "../../src";
import { JWKInterface } from "arbundles/node";
import { ownerToAddress } from "../testsHelpers/arweaveUtils";

test("getBalance function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = await createDataItemSignerNode(JWK);
  const client = new LiquidOps(signer);

  const walletAddress = await ownerToAddress(JWK.n);

  try {
    const res = await client.getBalance({
      tokenAddress: LiquidOps.tokens.wAR, // make it typed names?
      walletAddress,
    });

    expect(res).toBeTypeOf("number");
    expect(res).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(res)).toBe(true);

  } catch (error) {
    console.error("Error testing getBalance():", error);
    throw error;
  }
});