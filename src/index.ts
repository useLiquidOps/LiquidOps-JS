// LO functions
import { lend, Lend, LendRes } from "./functions/lend/lend";
import { unLend, UnLend, UnLendRes } from "./functions/lend/unLend";
import { borrow, Borrow, BorrowRes } from "./functions/borrow/borrow";
import {
  getTransactions,
  GetTransactions,
  GetTransactionsRes,
} from "./functions/getTransactions/getTransactions";
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
import { oTokens, tokens } from "./ao/utils/tokenAddressData";
// AO misc types/functions
import { connectToAO, AoUtils } from "./ao/utils/connect";
import { Services } from "@permaweb/aoconnect/dist/index.common";
type Configs = Services;
import { Types as AoConnectTypes } from "@permaweb/aoconnect/dist/dal";
type Signer = AoConnectTypes["signer"];

class LiquidOps {
  private aoUtils: AoUtils;

  constructor(signer: Signer, configs: Configs = {}) {
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

  async getTransactions(params: GetTransactions): Promise<GetTransactionsRes> {
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

export default LiquidOps;


// Type exports
export type {
  // borrow
  Borrow,
  BorrowRes,
  Repay,
  RepayRes,

  // getTransactions
  GetTransactions,
  GetTransactionsRes,

  // lend
  Lend,
  LendRes,
  UnLend,
  UnLendRes,

  // oTokenData
  GetAPR,
  GetBalances,
  GetBalancesRes,
  GetInfo,
  GetInfoRes,
  GetPosition,
  GetPositionRes,
  GetPrice,
  GetReserves,
  GetReservesRes,

  // protocol data
  GetAllPositions,
  GetAllPositionsRes,

  // utils
  GetBalance,
  Transfer,
  TransferRes,

  // Utility types for constructor/setup
  AoUtils,
  Signer,
  Configs
};

// Re-export static properties
export { oTokens, tokens };