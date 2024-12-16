// import { expect, test } from "bun:test";
// import LiquidOps from "../../../src";
// import createDataItemSignerBun from "../../testsHelpers/bunSigner";
// import { JWKInterface } from "arbundles/node";
// import { LendRes } from "../../../src/functions/lend/lend";

// test("lend function", async () => {
//   if (!process.env.JWK) {
//     throw new Error("Please specify a JWK in the .env file");
//   }

//   const JWK: JWKInterface = JSON.parse(process.env.JWK);
//   const signer = createDataItemSignerBun(JWK);
//   const client = new LiquidOps(signer);

//   try {
//     const res = await client.lend({
//       token: "QAR",
//       quantity: 1n,
//     }) as LendRes;

//     expect(res.status).toBe(true);

//   } catch (error) {
//     console.error("Error testing lend():", error);
//     throw error;
//   }
// });
