import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "../../testsHelpers/bunSigner/jwk-interface";
import { UnLendRes } from "../../../src/functions/lend/unLend";

test(
  "unLend function",
  async () => {
    if (!process.env.JWK) {
      throw new Error("Please specify a JWK in the .env file");
    }

    const JWK: JWKInterface = JSON.parse(process.env.JWK);
    const signer = createDataItemSignerBun(JWK);
    const client = new LiquidOps(signer);

    const res = (await client.unLend({
      token: "QAR",
      quantity: 1n,
    })) as UnLendRes;

    expect(res).toHaveProperty("status");
    expect(res).toHaveProperty("transferID");
    expect(typeof res.transferID).toBe("string");

    if (res.status === true) {
      expect(res.transferID).toBeDefined();
    } else if (res.status === "pending") {
      expect(res.response).toBe("Transaction pending.");
    }
  },
  { timeout: 30000 },
);
