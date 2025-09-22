import LiquidOps, { DryRunFIFO } from "./src";
import { ownerToAddress } from "./tests/testsHelpers/arweaveUtils";
import { createDataItemSigner } from "@permaweb/aoconnect";
import { formatGlobalPosition } from "./src/ao/utils/formatGlobalPosition";

if (!process.env.JWK) {
  throw new Error("Please specify a JWK in the .env file");
}

const JWK: any = JSON.parse(process.env.JWK);
const signer = createDataItemSigner(JWK);

LiquidOps.dryRunFifo = new DryRunFIFO([
  "https://cu1.ao-testnet.xyz",
  "https://cu24.ao-testnet.xyz",
  "https://cu-af.dataos.so",
  "https://cu.perplex.finance",
  "https://cu.arweave.asia",
  "https://cu.ardrive.io",
]);

const client = new LiquidOps(signer);

const walletAddress = await ownerToAddress(JWK.n);

//--------------------------------------------------------------------------------------------------------------- borrow

// const borrow = await client.borrow({
//   token: "QAR",
//   quantity: 1n,
// });

// console.log(borrow);

//-------------------------------

// const cooldown = await client.getCooldown({
//   token: "WUSDC",
//   recipient: "ue2K9OhujdC8NXOf_q4HARXtEFHKhc_AbILNA85yvnU"
// });

// console.log(cooldown)

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

//-------------------------------

// const earnings = await client.getEarnings({
//   token: "WUSDC",
//   collateralization: BigInt("10010931"),
//   walletAddress: "h037Kd9sfjYn7KyDvzkdqG5LVhry1dkKMj8aOJDq1F8"
// });

// console.log(earnings);

//--------------------------------------------------------------------------------------------------------------- liquidations

// const getLiquidationsMap = await client.getLiquidationsMap();

// console.log(getLiquidationsMap);

//-------------------------------

// const getLiquidations = await client.getLiquidations();

// console.log(getLiquidations);

//-------------------------------

// const liquidate = await client.liquidate({
//   token: "WUSDC",
//   rewardToken: "WAR",
//   targetUserAddress: "tGphuPlhxV5ppY_z2pQ_2JaU3-UU_8nVlgMmz7v4zDs",
//   quantity: 85101437n,
//   minExpectedQuantity: 80846365n,
// });

// console.log(liquidate);

//--------------------------------------------------------------------------------------------------------------- oTokenData

// const getBalances = await client.getBalances({
//   token: "QAR",
// });

// console.log(getBalances);

//-------------------------------

// const getBorrowAPR = await client.getBorrowAPR({
//   token: "QAR",
// });

// console.log(getBorrowAPR);

//-------------------------------

// const getExchangeRate = await client.getExchangeRate({
//   token: "QAR",
//   quantity: 1n
// });

// console.log(getExchangeRate);

//-------------------------------

// const getGlobalPosition = await client.getGlobalPosition({
//   walletAddress: "enMTr4rGpzcmno1W4RgihNfa2haOIuJoRD6OxSEvdH8",
// });

// console.log(formatGlobalPosition(getGlobalPosition));

//-------------------------------

// const getInfo = await client.getInfo({
//   token: "WUSDC",
// });

// console.log(getInfo);

//-------------------------------

// const getPosition = await client.getPosition({
//   token: "QAR",
//   recipient: walletAddress
// });

// console.log(getPosition);

//-------------------------------

// const getSupplyAPR = await client.getSupplyAPR({
//   token: "WUSDC",
// });

// console.log(getSupplyAPR);

//--------------------------------------------------------------------------------------------------------------- protocolData

// const getAllPositions = await client.getAllPositions({
//   token: "WUSDC",
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

// const getPrice = await client.getPrice({
//   token: "wAR",
// });

// console.log(getPrice);

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

// const result = await client.trackResult({
//   process: "7zH9dlMNoxprab9loshv3Y7WG45DOny_Vrq9KrXObdQ",
//   message: "bHjeHOic0GSOp4jMB9DbHs6ZXSWjCSNi_2iYTYjiKeg",
//   targetProcess: "4MW7uLFtttSLWM-yWEqV9TGD6fSIDrqa4lbTgYL2qHg",
//   match: {
//     success: {
//       Target: "ljvCPN31XCLPkBo9FUeB7vAK0VC6-eY52-CS-6Iho8U",
//       Tags: [
//         { name: "Action", values: "Mint-Confirmation" }
//       ]
//     },
//     fail: {
//       Target: "ljvCPN31XCLPkBo9FUeB7vAK0VC6-eY52-CS-6Iho8U",
//       Tags: [
//         { name: "Action", values: "Mint-Error" }
//       ]
//     }
//   }
// });

// console.log(result);
