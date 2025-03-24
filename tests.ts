import LiquidOps from "./src";
import createDataItemSignerBun from "./tests/testsHelpers/bunSigner/index";
import { JWKInterface } from "./tests/testsHelpers/bunSigner/jwk-interface";
import { ownerToAddress } from "./tests/testsHelpers/arweaveUtils";

if (!process.env.JWK) {
  throw new Error("Please specify a JWK in the .env file");
}

const JWK: JWKInterface = JSON.parse(process.env.JWK);
const signer = createDataItemSignerBun(JWK);
const client = new LiquidOps(signer);
const walletAddress = await ownerToAddress(JWK.n);

//--------------------------------------------------------------------------------------------------------------- borrow

// const borrow = await client.borrow({
//   token: "QAR",
//   quantity: 1n,
// });

// console.log(borrow);

//-------------------------------

// const repay = await client.repay({
//   token: "QAR",
//   quantity: 1n,
// });

// console.log(repay);

//--------------------------------------------------------------------------------------------------------------- getTransactions

// const getTransactions = await client.getTransactions({
//   token: "QAR",
//   action: "borrow",
//   walletAddress: walletAddress,
// });

// console.log(JSON.stringify(getTransactions, null, 2));

//--------------------------------------------------------------------------------------------------------------- lend

// const lend = await client.lend({
//   token: "QAR",
//   quantity: 1n,
// });

// console.log(lend);

//-------------------------------

// const unLend = await client.unLend({
//   token: "QAR",
//   quantity: 1n,
// });

// console.log(unLend);

//--------------------------------------------------------------------------------------------------------------- liquidations

// const getLiquidations = await client.getLiquidations({
//   token: "QAR",
// });

// console.log(getLiquidations);

//-------------------------------

// const liquidate = await client.liquidate({
//   token: "QAR",
//   rewardToken: "USDC",
//   targetUserAddress: "ljvCPN31XCLPkBo9FUeB7vAK0VC6-eY52-CS-6Iho8U",
//   quantity: 1n,
// });

// console.log(liquidate);

//--------------------------------------------------------------------------------------------------------------- oTokenData

// const getAPR = await client.getAPR({
//   token: "QAR",
// });

// console.log(getAPR);

//-------------------------------

// const getBalances = await client.getBalances({
//   token: "QAR",
// });

// console.log(getBalances);

//-------------------------------

// const getExchangeRate = await client.getExchangeRate({
//   token: "QAR",
//   quantity: 1n
// });

// console.log(getExchangeRate);

//-------------------------------

const getGlobalPosition = await client.getGlobalPosition({
  walletAddress: walletAddress
});

console.log(getGlobalPosition);

//-------------------------------

// const getInfo = await client.getInfo({
//   token: "QAR",
// });

// console.log(getInfo);

//-------------------------------

// const getPosition = await client.getPosition({
//   token: "QAR",
//   recipient: walletAddress
// });

// console.log(getPosition);

//--------------------------------------------------------------------------------------------------------------- protocolData

// const getAllPositions = await client.getAllPositions({
//   token: "QAR",
// });

// console.log(getAllPositions);

//-------------------------------

// const getHistoricalAPR = await client.getHistoricalAPR({
//   token: "QAR",
// });

// console.log(getHistoricalAPR);

//--------------------------------------------------------------------------------------------------------------- utils

// const getBalance = await client.getBalance({
//   tokenAddress: "XJYGT9ZrVdzQ5d7FzptIsKrJtEF4jWPbgC91bXuBAwU",
//   walletAddress: walletAddress,
// });

// console.log(getBalance);

//-------------------------------

// const getResult = await client.getResult({
//   transferID: "0RY-eSVV156qxyuHBs3GPO2pwsIvmA-yI1oKS1ABSyI",
//   tokenAddress: "XJYGT9ZrVdzQ5d7FzptIsKrJtEF4jWPbgC91bXuBAwU",
//   action: "lend",
// });

// console.log(getResult);

//-------------------------------

// const transfer = await client.transfer({
//   token: "QAR",
//   recipient: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
//   quantity: 1n
// });

// console.log(transfer)

//-------------------------------
