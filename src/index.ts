// borrow
import { borrow, Borrow, BorrowRes } from "./functions/borrow/borrow";
import { repay, Repay, RepayRes } from "./functions/borrow/repay";

// getTransactions
import {
  getTransactions,
  GetTransactions,
  GetTransactionsRes,
} from "./functions/getTransactions/getTransactions";

// lend
import { lend, Lend, LendRes } from "./functions/lend/lend";
import { unLend, UnLend, UnLendRes } from "./functions/lend/unLend";

// liquidations
import {
  getDiscountedQuantity,
  GetDiscountedQuantity,
  GetDiscountedQuantityRes,
} from "./functions/liquidations/getDiscountedQuantity";
import {
  getLiquidations,
  GetLiquidationsRes,
  QualifyingPosition,
  RedstonePrices,
} from "./functions/liquidations/getLiquidations";
import {
  liquidate,
  Liquidate,
  LiquidateRes,
} from "./functions/liquidations/liquidate";

// oTokenData
import {
  getBalances,
  GetBalances,
  GetBalancesRes,
} from "./functions/oTokenData/getBalances";
import {
  getBorrowAPR,
  GetBorrowAPR,
  GetBorrowAPRRes,
} from "./functions/oTokenData/getBorrowAPR";
import {
  getExchangeRate,
  GetExchangeRate,
  GetExchangeRateRes,
} from "./functions/oTokenData/getExchangeRate";
import {
  getGlobalPosition,
  GetGlobalPosition,
  GetGlobalPositionRes,
} from "./functions/oTokenData/getGlobalPosition";
import { getInfo, GetInfo, GetInfoRes } from "./functions/oTokenData/getInfo";
import {
  getPosition,
  GetPosition,
  GetPositionRes,
} from "./functions/oTokenData/getPosition";
import {
  getSupplyAPR,
  GetSupplyAPR,
  GetSupplyAPRRes,
} from "./functions/oTokenData/getSupplyAPR";
import {
  getCooldown,
  GetCooldown,
  GetCooldownRes,
} from "./functions/oTokenData/getCooldown";

// protocolData
import {
  getAllPositions,
  GetAllPositions,
  GetAllPositionsRes,
} from "./functions/protocolData/getAllPositions";
import {
  getHistoricalAPR,
  GetHistoricalAPR,
  GetHistoricalAPRRes,
} from "./functions/protocolData/getHistoricalAPR";

// utils
import {
  getBalance,
  GetBalance,
  GetBalanceRes,
} from "./functions/utils/getBalance";
import {
  getResult,
  GetResult,
  GetResultRes,
} from "./functions/utils/getResult";
import { transfer, Transfer, TransferRes } from "./functions/utils/transfer";

// LO helpful data
import {
  oTokens,
  tokens,
  controllerAddress,
  tokenData,
  TokenData,
} from "./ao/utils/tokenAddressData";
import { TokenInput, tokenInput } from "./ao/utils/tokenInput";

// Class needed types/funtions
import { connectToAO, AoUtils } from "./ao/utils/connect";
import { Services } from "./ao/utils/connect";
type Configs = Services;
import { Types as AoConnectTypes } from "@permaweb/aoconnect/dist/dal";
type Signer = AoConnectTypes["signer"];

class LiquidOps {
  private aoUtils: AoUtils;

  constructor(signer: Signer, configs: Omit<Configs, "MODE"> = {}) {
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

  //--------------------------------------------------------------------------------------------------------------- borrow

  async borrow<T extends Borrow>(
    params: T,
  ): Promise<T["noResult"] extends true ? string : BorrowRes> {
    return borrow(this.aoUtils, params);
  }

  async repay<T extends Repay>(
    params: T,
  ): Promise<T["noResult"] extends true ? string : RepayRes> {
    return repay(this.aoUtils, params);
  }

  //--------------------------------------------------------------------------------------------------------------- getTransactions

  async getTransactions(params: GetTransactions): Promise<GetTransactionsRes> {
    return getTransactions(this.aoUtils, params);
  }

  //--------------------------------------------------------------------------------------------------------------- lend

  async lend<T extends Lend>(
    params: T,
  ): Promise<T["noResult"] extends true ? string : LendRes> {
    return lend(this.aoUtils, params);
  }

  async unLend<T extends UnLend>(
    params: T,
  ): Promise<T["noResult"] extends true ? string : UnLendRes> {
    return unLend(this.aoUtils, params);
  }

  //--------------------------------------------------------------------------------------------------------------- liquidations

  getDiscountedQuantity(
    params: GetDiscountedQuantity,
  ): GetDiscountedQuantityRes {
    return getDiscountedQuantity(params, LiquidOps.liquidationPrecisionFactor);
  }

  static liquidationPrecisionFactor = 1000000;

  async getLiquidations(): Promise<GetLiquidationsRes> {
    return getLiquidations(LiquidOps.liquidationPrecisionFactor);
  }

  async liquidate(params: Liquidate): Promise<LiquidateRes> {
    return liquidate(this.aoUtils, params);
  }

  //--------------------------------------------------------------------------------------------------------------- oTokenData

  async getBalances(params: GetBalances): Promise<GetBalancesRes> {
    return getBalances(params);
  }

  async getBorrowAPR(params: GetBorrowAPR): Promise<GetBorrowAPRRes> {
    return getBorrowAPR(params);
  }

  async getCooldown(params: GetCooldown): Promise<GetCooldownRes> {
    return getCooldown(params);
  }

  async getExchangeRate(params: GetExchangeRate): Promise<GetExchangeRateRes> {
    return getExchangeRate(params);
  }

  async getGlobalPosition(
    params: GetGlobalPosition,
  ): Promise<GetGlobalPositionRes> {
    return getGlobalPosition(params);
  }

  async getInfo(params: GetInfo): Promise<GetInfoRes> {
    return getInfo(params);
  }

  async getPosition(params: GetPosition): Promise<GetPositionRes> {
    return getPosition(params);
  }

  async getSupplyAPR(params: GetSupplyAPR): Promise<GetSupplyAPRRes> {
    return getSupplyAPR(params);
  }

  //--------------------------------------------------------------------------------------------------------------- protocolData

  async getAllPositions(params: GetAllPositions): Promise<GetAllPositionsRes> {
    return getAllPositions(params);
  }

  async getHistoricalAPR(
    params: GetHistoricalAPR,
  ): Promise<GetHistoricalAPRRes> {
    return getHistoricalAPR(params);
  }

  //--------------------------------------------------------------------------------------------------------------- utils

  async getBalance(params: GetBalance): Promise<GetBalanceRes> {
    return getBalance(params);
  }

  async getResult(params: GetResult): Promise<GetResultRes> {
    return getResult(this.aoUtils, params);
  }

  async transfer(params: Transfer): Promise<TransferRes> {
    return transfer(this.aoUtils, params);
  }

  //--------------------------------------------------------------------------------------------------------------- process data

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

  // liquidations
  GetDiscountedQuantity,
  GetDiscountedQuantityRes,
  GetLiquidationsRes,
  Liquidate,
  LiquidateRes,
  // addional helpful liquidation types
  QualifyingPosition,
  RedstonePrices,

  // oTokenData
  GetBalances,
  GetBalancesRes,
  GetBorrowAPR,
  GetBorrowAPRRes,
  GetExchangeRate,
  GetExchangeRateRes,
  GetGlobalPosition,
  GetGlobalPositionRes,
  GetInfo,
  GetInfoRes,
  GetPosition,
  GetPositionRes,
  GetSupplyAPR,
  GetSupplyAPRRes,

  // protocol data
  GetAllPositions,
  GetAllPositionsRes,
  GetHistoricalAPR,
  GetHistoricalAPRRes,

  // utils
  GetBalance,
  GetBalanceRes,
  GetResult,
  GetResultRes,
  Transfer,
  TransferRes,

  // Utility types for constructor/setup
  AoUtils,
  Signer,
  Configs,
  TokenInput,
  TokenData,
};

// Re-export static properties
export { oTokens, tokens, controllerAddress, tokenInput, tokenData };
