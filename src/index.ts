// LO functions
import { lend, Lend, LendRes } from "./functions/lend/lend";
import { unLend, UnLend, UnLendRes } from "./functions/lend/unLend";
import { borrow, Borrow, BorrowRes } from "./functions/borrow/borrow";
import {
  getTransactions,
  GetTransactions,
} from "./functions/getTransactions/getTransactions";
import { Transaction } from "./arweave/getTags";
import { repay, Repay, RepayRes } from "./functions/borrow/repay";
import { getAPR, GetAPR } from "./functions/oTokenData/getAPR";
import { getBalance, GetBalance } from "./functions/utils/getBalance";
import {
  getReserves,
  GetReserves,
  GetReservesRes,
} from "./functions/oTokenData/getReserves";
import { getPrice, GetPrice } from "./functions/oTokenData/getPrice";
import { getInfo, GetInfo, GetInfoRes } from "./functions/oTokenData/getInfo";
import { transfer, Transfer, TransferRes } from "./functions/utils/transfer";
import {
  getConfig,
  GetConfig,
  GetConfigRes,
} from "./functions/oTokenData/getConfig";
import {
  getPosition,
  GetPosition,
  GetPositionRes,
} from "./functions/oTokenData/getPosition";
import {
  getBalances,
  GetBalances,
  GetBalancesRes,
} from "./functions/oTokenData/getBalances";
import {
  getAllPositions,
  GetAllPositions,
  GetAllPositionsRes,
} from "./functions/protocolData/getAllPositions";
// LO helpful data
import { oTokens, tokens } from "./ao/tokenAddressData";
// AO misc types/functions
import { connectToAO, aoUtils } from "./ao/connect";
import { Services } from "@permaweb/aoconnect/dist/index.common";
import { Types as aoconnectTypes } from "@permaweb/aoconnect/dist/dal";
// AO helpful functions
import { createDataItemSigner as createDataItemSignerNode } from "@permaweb/aoconnect/dist/client/node/wallet";
import { createDataItemSigner as createDataItemSignerWeb } from "@permaweb/aoconnect/browser";

class LiquidOps {
  private aoUtils: aoUtils;

  constructor(signer: aoconnectTypes["signer"], configs: Services = {}) {
    if (!signer) {
      throw new Error("Please specify a ao createDataItemSigner signer");
    }

    const { spawn, message, result } = connectToAO(configs);
    this.aoUtils = {
      spawn,
      message,
      result,
      signer,
      configs,
    };
  }

  // borrow

  async borrow(params: Borrow): Promise<BorrowRes> {
    return borrow(this.aoUtils, params);
  }

  async repay(params: Repay): Promise<RepayRes> {
    return repay(this.aoUtils, params);
  }

  // getTransactions

  async getTransactions(
    params: GetTransactions,
  ): Promise<{ node: Transaction }[]> {
    return getTransactions(this.aoUtils, params);
  }

  // lend

  async lend(params: Lend): Promise<LendRes> {
    return lend(this.aoUtils, params);
  }

  async unLend(params: UnLend): Promise<UnLendRes> {
    return unLend(this.aoUtils, params);
  }

  // oTokenData

  async getAPR(params: GetAPR): Promise<number> {
    return getAPR(this.aoUtils, params);
  }

  async getBalances(params: GetBalances): Promise<GetBalancesRes> {
    return getBalances(this.aoUtils, params);
  }

  async getConfig(params: GetConfig): Promise<GetConfigRes> {
    return getConfig(this.aoUtils, params);
  }

  async getInfo(params: GetInfo): Promise<GetInfoRes> {
    return getInfo(this.aoUtils, params);
  }

  async getPosition(params: GetPosition): Promise<GetPositionRes> {
    return getPosition(this.aoUtils, params);
  }

  async getPrice(params: GetPrice): Promise<BigInt> {
    return getPrice(this.aoUtils, params);
  }

  async getReserves(params: GetReserves): Promise<GetReservesRes> {
    return getReserves(this.aoUtils, params);
  }

  // protocol data

  async getAllPositions(params: GetAllPositions): Promise<GetAllPositionsRes> {
    return getAllPositions(this.aoUtils, params);
  }

  // utils

  async getBalance(params: GetBalance): Promise<BigInt> {
    return getBalance(params);
  }

  async transfer(params: Transfer): Promise<TransferRes> {
    return transfer(this.aoUtils, params);
  }

  // process data

  static oTokens = oTokens;
  static tokens = tokens;
}

export { createDataItemSignerNode, createDataItemSignerWeb };
export default LiquidOps;

// TODO
// getTxns return type
// check with marton on getAllPositions function
// double check on exporting signers
// write/finalize tests for new function res types + handling for a incomplete res + figure out res response
// double check all new types and return types (compare to paper)
// README docs
// double check all functions are complete


// borrow - Borrow
// repay - Repay

// getTransactions - new function (Arweave GQL)

// lend - Mint
// unLend - Redeem

// getAPR - Get-APR
// getBalance - Balances // check this
// getConfig - Get-Config
// getInfo - Info
// getPosition - Position
// getPrice - Get-Price
// getReserves - Get-Reserves

// getAllPositions - Position // TODO find action

// getBalance - new function (ao-tokens)
// transfer - Transfer
