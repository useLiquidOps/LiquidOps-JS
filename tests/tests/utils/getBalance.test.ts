import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "../../testsHelpers/bunSigner/jwk-interface";
import { ownerToAddress } from "../../testsHelpers/arweaveUtils";

test("getBalance function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);
  const walletAddress = await ownerToAddress(JWK.n);

  try {
    const res = await client.getBalance({
      tokenAddress: "XJYGT9ZrVdzQ5d7FzptIsKrJtEF4jWPbgC91bXuBAwU",
      walletAddress,
    });

    expect(typeof res).toBe("bigint");
    expect(res).toBeGreaterThanOrEqual(0n);
  } catch (error) {
    console.error("Error testing getBalance():", error);
    throw error;
  }
});
