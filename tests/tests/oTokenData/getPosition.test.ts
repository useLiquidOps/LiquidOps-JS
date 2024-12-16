import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "arbundles/node";
import { GetPositionRes } from "../../../src/functions/oTokenData/getPosition";
import { ownerToAddress } from "../../testsHelpers/arweaveUtils";

test("getPosition function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);
  const walletAddress = await ownerToAddress(JWK.n);

  try {
    const res = (await client.getPosition({
      token: "QAR",
      recipient: walletAddress,
    })) as GetPositionRes;

    expect(res).toBeTypeOf("object");
    expect(res.capacity).toBeTypeOf("string");
    expect(res.usedCapacity).toBeTypeOf("string");
    expect(res.collateralTicker).toBeTypeOf("string");
    expect(res.collateralDenomination).toBeTypeOf("string");

    expect(BigInt(res.capacity)).toBeGreaterThanOrEqual(0n);
    expect(BigInt(res.usedCapacity)).toBeGreaterThanOrEqual(0n);
    expect(BigInt(res.usedCapacity)).toBeLessThanOrEqual(BigInt(res.capacity));
    expect(res.collateralTicker.length).toBeGreaterThan(0);
    expect(BigInt(res.collateralDenomination)).toBeGreaterThan(0n);
  } catch (error) {
    console.error("Error testing getPosition():", error);
    throw error;
  }
});
