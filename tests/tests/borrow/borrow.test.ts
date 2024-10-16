import { expect, test } from "bun:test";
import LiquidOps from "../../../src";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { JWKInterface } from "arbundles/node";
import { SendMessageRes, MessageResult } from "../../../src/ao/sendMessage";

test("borrow function", async () => {
  if (!process.env.JWK) {
    throw new Error("Please specify a JWK in the .env file");
  }

  const JWK: JWKInterface = JSON.parse(process.env.JWK);
  const signer = createDataItemSigner(JWK);
  const client = new LiquidOps(signer);

  try {
    const res = (await client.borrow({
      token: "wAR",
      quantity: 10n,
    })) as SendMessageRes & MessageResult;

    if (res.Error) {
      throw new Error(`Borrow function error: ${JSON.stringify(res.Error)}`);
    }

    expect(res).toHaveProperty("id");
    expect(res.id).toBeTypeOf("string");
    expect(res.id.length).toBeGreaterThan(0);

    expect(res).toHaveProperty("Output");
    expect(res).toHaveProperty("Messages");
    expect(Array.isArray(res.Messages)).toBe(true);
    expect(res).toHaveProperty("Spawns");
    expect(Array.isArray(res.Spawns)).toBe(true);
  } catch (error) {
    console.error("Error testing borrow():", error);
    throw error;
  }
});
