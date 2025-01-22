import LiquidOps from "./src";
import createDataItemSignerBun from "./tests/testsHelpers/bunSigner/index";
import { JWKInterface } from "arbundles/node";
import { ownerToAddress } from "./tests/testsHelpers/arweaveUtils";

if (!process.env.JWK) {
  throw new Error("Please specify a JWK in the .env file");
}

const JWK: JWKInterface = JSON.parse(process.env.JWK);
const signer = createDataItemSignerBun(JWK);
const client = new LiquidOps(signer);
const walletAddress = await ownerToAddress(JWK.n);

// // get transactions

// const getTransactions = await client.getTransactions({
//   token: "QAR",
//   action: "lend",
//   walletAddress: walletAddress,
// });

// console.log(JSON.stringify(getTransactions, null, 2));

// // lend

// const lend = await client.lend({
//   token: "QAR",
//   quantity: 1n,
// });

// console.log(lend);

// const unLend = await client.unLend({
//   token: "QAR",
//   quantity: 1n,
// });

// console.log(unLend);

// // oTokenData

// const getAPR = await client.getAPR({
//   token: "QAR",
// });

// console.log(getAPR);

// const getBalances = await client.getBalances({
//   token: "QAR",
// });

// console.log(getBalances);

// const getInfo = await client.getInfo({
//   token: "QAR",
// });

// console.log(getInfo);

// const getPosition = await client.getPosition({
//   token: "QAR",
//   recipient: walletAddress
// });

// console.log(getPosition)

// const getPrice = await client.getPrice({
//   token: "QAR",
//   quantity: BigInt(1)
// });

// console.log(getPrice)

// const getReserves = await client.getReserves({
//   token: "QAR",
// });

// console.log(getReserves)

// // protocolData

// const getAllPositions = await client.getAllPositions({
//   token: "QAR",
// });

// console.log(getAllPositions)

// const getHistoricalAPR = await client.getHistoricalAPR({
//   token: "QAR",
// });

// console.log(getHistoricalAPR);

// const getLiquidations = client.getLiquidations({
//   token: "QAR"
// });

// console.log(getLiquidations);

// // utils

// const getBalance = await client.getBalance({
//   token: "QAR",
//   walletAddress: walletAddress
// });

// console.log(getBalance)

// const transfer = await client.transfer({
//   token: "QAR",
//   recipient: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
//   quantity: 1n
// });

// console.log(transfer)

// // borrow

// const borrow = await client.borrow({
//   token: "QAR",
//   quantity: 1n,
// });

// console.log(borrow);

// const repay = await client.repay({
//   token: "QAR",
//   quantity: 1n,
// });

// console.log(repay);

// // liquidation

// const liquidate = client.liquidate({
//   token: "QAR",
//   rewardToken: "STETH",
//   targetUserAddress: "",
//   quantity: 1n,
// });

// console.log(liquidate);
