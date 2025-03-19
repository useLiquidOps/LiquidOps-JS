import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "../../testsHelpers/bunSigner/jwk-interface";
import { GetAllPositionsRes } from "../../../src/functions/protocolData/getAllPositions";

test("getAllPositions function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.getAllPositions({
      token: "QAR",
    })) as GetAllPositionsRes;

    expect(res).toBeTypeOf("object");

    expect(typeof res.capacity).toBe("bigint");
    expect(typeof res.usedCapacity).toBe("bigint");

    expect(res.capacity).toBeGreaterThanOrEqual(0n);
    expect(res.usedCapacity).toBeGreaterThanOrEqual(0n);
    expect(res.usedCapacity).toBeLessThanOrEqual(res.capacity);
  } catch (error) {
    console.error("Error testing getAllPositions():", error);
    throw error;
  }
});
