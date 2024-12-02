import LiquidOps from "./src";
import createDataItemSignerBun from "./tests/testsHelpers/bunSigner/index";
import { JWKInterface } from "arbundles/node";

if (!process.env.JWK) {
  throw new Error("Please specify a JWK in the .env file");
}

const JWK: JWKInterface = JSON.parse(process.env.JWK);
const signer = createDataItemSignerBun(JWK);
const client = new LiquidOps(signer);

const res = await client.lend({
  token: "wAR",
  quantity: 10n,
});

console.log(res);
