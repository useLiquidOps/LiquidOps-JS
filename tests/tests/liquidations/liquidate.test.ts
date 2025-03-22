import { expect, test, describe } from "bun:test";
import LiquidOps from "../../../src";
import createDataItemSignerBun from "../../testsHelpers/bunSigner";
import { JWKInterface } from "../../testsHelpers/bunSigner/jwk-interface";
import { LiquidateRes } from "../../../src";

test(
  "liquidate function",
  async () => {
    if (!process.env.JWK) {
      throw new Error("Please specify a JWK in the .env file");
    }

    const JWK: JWKInterface = JSON.parse(process.env.JWK);
    const signer = createDataItemSignerBun(JWK);
    const client = new LiquidOps(signer);

    // change this to a for loop to test all supported tokens
    const res = (await client.liquidate({
      token: "QAR",
      rewardToken: "USDC",
      targetUserAddress: "",
      quantity: 1n,
    })) as LiquidateRes;

    // TODO: excpect types and finish test
  },
  { timeout: 30000 },
);
