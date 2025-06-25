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
  getLiquidationsMap,
  GetLiquidationsMapRes,
} from "./functions/liquidations/getLiquidationsMap";
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
import { getPrice, GetPrice, GetPriceRes } from "./functions/utils/getPrice";
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
import { AoUtils } from "./ao/utils/connect";
import { Services } from "./ao/utils/connect";
type Configs = Services;
import {
  trackResult,
  TrackResult,
  TrackResultRes,
} from "./functions/utils/trackResult";
import {
  getEarnings,
  GetEarnings,
  GetEarningsRes,
} from "./functions/lend/getEarnings";

class LiquidOps {
  private signer: any;
  private configs: Omit<Configs, "MODE">;

  constructor(signer: any, configs: Omit<Configs, "MODE"> = {}) {
    if (!signer) {
      throw new Error("Please specify a ao createDataItemSigner signer");
    }
    this.signer = signer;
    this.configs = configs;
  }

  //--------------------------------------------------------------------------------------------------------------- borrow

  async borrow<T extends Borrow>(
    params: T,
  ): Promise<T["noResult"] extends true ? string : BorrowRes> {
    return borrow({ signer: this.signer, configs: this.configs }, params);
  }

  async repay<T extends Repay>(
    params: T,
  ): Promise<T["noResult"] extends true ? string : RepayRes> {
    return repay({ signer: this.signer, configs: this.configs }, params);
  }

  //--------------------------------------------------------------------------------------------------------------- getTransactions

  async getTransactions(params: GetTransactions): Promise<GetTransactionsRes> {
    return getTransactions(
      { signer: this.signer, configs: this.configs },
      params,
    );
  }

  //--------------------------------------------------------------------------------------------------------------- lend

  async lend<T extends Lend>(
    params: T,
  ): Promise<T["noResult"] extends true ? string : LendRes> {
    return lend({ signer: this.signer, configs: this.configs }, params);
  }

  async unLend<T extends UnLend>(
    params: T,
  ): Promise<T["noResult"] extends true ? string : UnLendRes> {
    return unLend({ signer: this.signer, configs: this.configs }, params);
  }

  async getEarnings(params: GetEarnings): Promise<GetEarningsRes> {
    return getEarnings({ signer: this.signer, configs: this.configs }, params);
  }

  //--------------------------------------------------------------------------------------------------------------- liquidations

  static liquidationPrecisionFactor = 1000000;

  getDiscountedQuantity(
    params: GetDiscountedQuantity,
  ): GetDiscountedQuantityRes {
    return getDiscountedQuantity(params, LiquidOps.liquidationPrecisionFactor);
  }

  async getLiquidationsMap(): Promise<GetLiquidationsMapRes[]> {
    return getLiquidationsMap();
  }

  async getLiquidations(): Promise<GetLiquidationsRes> {
    return getLiquidations(LiquidOps.liquidationPrecisionFactor);
  }

  async liquidate(params: Liquidate): Promise<LiquidateRes> {
    return liquidate({ signer: this.signer, configs: this.configs }, params);
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

  async getPrice(params: GetPrice): Promise<GetPriceRes> {
    return getPrice(params);
  }

  async getResult(params: GetResult): Promise<GetResultRes> {
    return getResult({ signer: this.signer, configs: this.configs }, params);
  }

  async transfer(params: Transfer): Promise<TransferRes> {
    return transfer({ signer: this.signer, configs: this.configs }, params);
  }

  async trackResult(params: TrackResult): Promise<TrackResultRes | undefined> {
    return trackResult({ signer: this.signer, configs: this.configs }, params);
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
  TrackResult,
  TrackResultRes,

  // Utility types for constructor/setup
  AoUtils,
  Configs,
  TokenInput,
  TokenData,
};

// Re-export static properties
export { oTokens, tokens, controllerAddress, tokenInput, tokenData };
