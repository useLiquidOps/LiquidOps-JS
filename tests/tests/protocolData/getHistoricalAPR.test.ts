import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "../../testsHelpers/bunSigner/jwk-interface";

test("getHistoricalAPR function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSignerBun(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = await client.getHistoricalAPR({
      token: "QAR",
    });

    // Verify the function returns the correct structure
    expect(Array.isArray(res)).toBe(true);

    // Skip further tests if the array is empty
    if (res.length > 0) {
      // Verify the data content
      res.forEach((item) => {
        expect(item).toHaveProperty("apr");
        expect(item).toHaveProperty("timestamp");
        expect(typeof item.apr).toBe("number");
        expect(typeof item.timestamp).toBe("number");
        expect(item.apr).toBeGreaterThanOrEqual(0); // APR should be non-negative
      });
    }
  } catch (error) {
    console.error("Error testing getHistoricalAPR():", error);
    throw error;
  }
});
