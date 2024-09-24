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
import LiquidOps, { createDataItemSignerNode } from "liquidops";

const JWK = process.env.JWK;
const signer = await createDataItemSignerNode(JWK);

const client = new LiquidOps(signer);

const lendRes = await client.lend({
  poolID: LiquidOps.oTokens.wAR,
  poolTokenID: "",
  quantity: 10,
});

console.log(lendRes);

// {
//  "blah": "6jdzO4FzS4EVaQVcLBEmxm6uN5-1tqBXW24Pzp6JsRQ",
//  "blah1": "6jdzO4FzS4EVaQVcLBEmxm6uN5-1tqBXW24Pzp6JsRQ",
//  "blah2": "6jdzO4FzS4EVaQVcLBEmxm6uN5-1tqBXW24Pzp6JsRQ",
// }
```

---

## Configuration

The SDK can be configured with the following options:

WHAT ARE OTOKENS? (When interacting with LiquidOps you use oTokens which stand for operation tokens.)

```typescript
const client = new LiquidOps(window.arweaveWallet, {
  GATEWAY_URL: "",
  GRAPHQL_URL: "",
  GRAPHQL_MAX_RETRIES: "",
  GRAPHQL_RETRY_BACKOFF: "",
  MU_URL: "",
  CU_URL: "",
});
```

---

## Lending

Lending on LiquidOps

### lend()

```typescript
example;
```

### unLend()

```typescript
example;
```

---

## Borrowing

Borrowing on LiquidOps

### borrow()

```typescript
example;
```

### repay()

```typescript
example;
```

### payInterest()

```typescript
example;
```

---

## Pool Data

LiquidOps pool data

### getAPY()

```typescript
example;
```

### getBalance()

```typescript
example;
```

### getLiquidity()

```typescript
example;
```

---

## Position Data

LiquidOps position data

### getLent()

```typescript
example;
```

### getBorrowed()

```typescript
example;
```

### getTransactions()

```typescript
example;
```

---

## Need Help?

If you're stuck or have any questions, our community is here to help!

### For real-time support and discussions:

1. Click this invite link: [LiquidOps Discord](https://)
2. Once in the server, head to the `#developer` channel
3. Feel free to ask your questions or share your projects!

### Anything else:

For bug reports, feature requests, or more complex problems:

1. Go to our [GitHub Issues page](https://github.com/useLiquidOps/LiquidOps-JS/issues)
2. Click on "New Issue"
3. Provide a clear title and detailed description of your issue

---

## Contributing

See CONTRIBUTING.md

---

## License

This software is released under MIT license. See LICENSE.md for full license details.
