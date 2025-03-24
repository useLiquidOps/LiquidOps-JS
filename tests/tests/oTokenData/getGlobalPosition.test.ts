import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "../../testsHelpers/bunSigner/jwk-interface";
import { ownerToAddress } from "../../testsHelpers/arweaveUtils";
import { GetGlobalPositionRes } from "../../../src";

test("getGlobalPosition function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);
  const walletAddress = await ownerToAddress(JWK.n);

  try {
    const res = (await client.getGlobalPosition({
        walletAddress
    })) as GetGlobalPositionRes;

   // TODO: excpect types and finish test
  } catch (error) {
    console.error("Error testing getGlobalPosition():", error);
    throw error;
  }
});
