# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LiquidOps-JS is a TypeScript/JavaScript SDK for interacting with the LiquidOps over-collateralized lending and borrowing protocol built on Arweave's L2 AO network. The SDK provides a high-level interface for DeFi operations including lending, borrowing, liquidations, and protocol data retrieval.

## Development Commands

### Build and Development
- `bun run build` - Build the TypeScript project using tsup (outputs to dist/)
- `bun run dev` - Full development cycle: format, build, and link
- `bun run prettier` - Format all code using Prettier
- `bun run link` - Link the package locally for testing
- `bun run script` - Run dev cycle and execute test.ts

### Testing
- `bun test` - Run all tests using Bun's built-in test runner
- Individual test files are located in `tests/tests/` organized by feature

## Architecture

### Core Class Structure
The main `LiquidOps` class (src/index.ts) acts as the primary interface, requiring an AO signer and optional configuration. All methods are async and use the signer for blockchain interactions.

### Function Organization
```
src/functions/
├── borrow/         # Borrowing and repayment operations
├── lend/           # Lending and unlending operations  
├── liquidations/   # Liquidation detection and execution
├── oTokenData/     # Token-specific data (APR, balances, positions)
├── protocolData/   # Protocol-wide statistics and positions
└── utils/          # Utility functions (balance, price, transfers)
```

### AO Network Integration
- `src/ao/messaging/` - AO network messaging utilities (getData, sendData)
- `src/ao/utils/connect.ts` - AO connection management with retry logic
- Uses `@permaweb/aoconnect` for AO network communication
- Supports both "legacy" and "mainnet" modes via configuration

### Key Dependencies
- `@permaweb/aoconnect` - Core AO network connectivity
- `ao-tokens` - Token utilities (peer dependency)
- `ar-gql` - Arweave GraphQL queries
- `arbundles` - Arweave bundle utilities

### Token System
Static token data is managed in `src/ao/utils/tokenAddressData.ts` including:
- `oTokens` - Available oToken addresses
- `tokens` - Standard token addresses  
- `controllerAddress` - Protocol controller
- `tokenInput()` helper for token parameter parsing

### Type System
All functions export TypeScript interfaces for parameters and return types following the pattern `FunctionName`, `FunctionNameRes` (e.g., `Borrow`, `BorrowRes`).

## Development Notes

### Build System
- Uses `tsup` for building with CJS, ESM, and TypeScript declaration outputs
- Target: ES2018 with DOM libraries
- Exports both CommonJS and ES module formats

### Testing Strategy
Tests mirror the function structure and use Bun's test runner. Helper utilities are in `tests/testsHelpers/`.

### AO Network Patterns
Functions that interact with AO require a signer and follow the pattern of using `getData()` for queries and `sendData()` for transactions. Connection retry logic is built into the `connectToAO()` utility.