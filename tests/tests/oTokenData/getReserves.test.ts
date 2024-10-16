import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";

test("getReserves function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);

  const client = new LiquidOps(signer);

  const res = await client.getReserves({
    token: "wAR",
  });

  expect(res.Target).toBeTypeOf("string"); // TODO
});
