# LiquidOps JS

LiquidOps JS provides a seamless way to interact with the LiquidOps protocol in TypeScript and JavaScript projects. This SDK simplifies the process of interacting on ao/arweave with LiquidOps

---

# Installation

You can install the LiquidOps JS using npm:

```bash
npm i liquidops
```

Or using yarn:

```bash
yarn add liquidops
```

Or using bun:

```bash
bun i liquidops
```

---

# Quick Start

Here's a simple lending example to get you started:

```typescript
import LiquidOps from "liquidops";
import { createDataItemSigner } from "@permaweb/aoconnect";

const signer = createDataItemSigner(window.arweaveWallet);

const client = new LiquidOps(signer);
```

---

# Examples

## Token Data and Utilities

```typescript
// Access supported token data
import { tokenData, tokens, oTokens, controllers } from "liquidops";

// Get token details (name, icon, addresses)
const qarData = tokenData.QAR;
/* {
    name: "Quantum Arweave",
    ticker: "QAR", 
    address: "XJYGT9...",
    oTicker: "oQAR",
    oAddress: "CbT2b...",
    controllerAddress: "vYlv6...",
    // ...other metadata
} */

// Get base token addresses
const tokenAddress = tokens.QAR; // "XJYGT9..."

// Get oToken addresses
const oTokenAddress = oTokens.oQAR; // "CbT2b..."

// Get controller addresses
const controllerAddress = controllers.QAR; // "vYlv6..."

// Helper function to resolve token addresses and related data
import { tokenInput, type TokenInput } from "liquidops";

// Can use either ticker or address
const resolved = tokenInput("QAR");
// OR
const resolved = tokenInput("XJYGT9ZrVdzQ5d7FzptIsKrJtEF4jWPbgC91bXuBAwU");

/* Returns:
{
  tokenAddress: "XJYGT9...",    // Base token address
  oTokenAddress: "CbT2b...",    // oToken address
  controllerAddress: "vYlv6..." // Controller contract address
}
*/
```

Currently supported tokens: QAR (Test Quantum Arweave), STETH (Test Staked Ethereum), USDC (Test USD Circle)

## Transaction Functions

```typescript
// Get transactions for a specific token and action
const getTransactions = await client.getTransactions({
  token: "QAR",
  action: "lend", // "lend" | "unLend" | "borrow" | "repay";
  walletAddress: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
});
```

## Lending Functions

```typescript
// Lend tokens
const lend = await client.lend({
  token: "QAR",
  quantity: 1n,
});

// Unlend tokens
const unLend = await client.unLend({
  token: "QAR",
  quantity: 1n,
});
```

## oToken Data Functions

```typescript
// Get APR for a token
const getAPR = await client.getAPR({
  token: "QAR",
});

// Get balances
const getBalances = await client.getBalances({
  token: "QAR",
});

// Get token info
const getInfo = await client.getInfo({
  token: "QAR",
});

// Get position for a wallet
const getPosition = await client.getPosition({
  token: "QAR",
  recipient: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
});

// Get price for quantity
const getPrice = await client.getPrice({
  token: "QAR",
  quantity: 1n,
});

// Get reserves
const getReserves = await client.getReserves({
  token: "QAR",
});
```

## Protocol Data Functions

```typescript
// Get all positions
const getAllPositions = await client.getAllPositions({
  token: "QAR",
});

// Get historical APR

const getHistoricalAPR = await client.getHistoricalAPR({
  token: "QAR",
});

// Get liquidations
const getLiquidations = client.getLiquidations({
  token: "QAR",
});
```

## Utility Functions

```typescript
// Get balance
const getBalance = await client.getBalance({
  token: "XJYGT9ZrVdzQ5d7FzptIsKrJtEF4jWPbgC91bXuBAwU",
  walletAddress: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
});

// Transfer tokens
const transfer = await client.transfer({
  token: "QAR",
  recipient: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
  quantity: 1n,
});

// Get result
const getResult = await client.getResult({
  transferID: "0RY-eSVV156qxyuHBs3GPO2pwsIvmA-yI1oKS1ABSyI",
  tokenAddress: "XJYGT9ZrVdzQ5d7FzptIsKrJtEF4jWPbgC91bXuBAwU",
  action: "lend", // "lend" | "unLend" | "borrow" | "repay";
});
```

## Borrowing Functions

```typescript
// Borrow tokens
const borrow = await client.borrow({
  token: "QAR",
  quantity: 1n,
});

// Repay borrowed tokens
const repay = await client.repay({
  token: "QAR",
  quantity: 1n,
});
```

## Liquidation Functions

```typescript
// Liquidate a position
const liquidate = client.liquidate({
  token: "QAR",
  rewardToken: "STETH",
  targetUserAddress: "psh5nUh3VF22Pr8LeoV1K2blRNOOnoVH0BbZ85yRick",
  quantity: 1n,
});
```

---

### For real-time support and discussions:

1. Click this invite link: [LiquidOps Discord](https://discord.com/invite/Jad4v8ykgY)
2. Once in the server, head to the `#developer` channel
3. Feel free to ask your questions or share your projects!

---

### Anything else:

For bug reports, feature requests, or more complex problems:

1. Go to our [GitHub Issues page](https://github.com/useLiquidOps/LiquidOps-JS/issues)
2. Click on "New Issue"
3. Provide a clear title and detailed description of your issue

---

## License

This software is released under MIT license. See LICENSE.md for full license details.
