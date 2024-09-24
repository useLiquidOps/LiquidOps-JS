// LO functions
import { lend, Lend } from "./lend/lend";
import { unLend, UnLend } from "./lend/unLend";
import { borrow, Borrow } from "./borrow/borrow";
import { repay, Repay } from "./borrow/repay";
import { payInterest, PayInterest } from "./borrow/payInterest";
import { getAPY, GetAPY } from "./oTokenData/getAPY";
import { getBalance, GetBalance } from "./oTokenData/getBalance";
import {
  getReserves,
  GetReserves,
  GetReservesRes,
} from "./oTokenData/getReserves";
import { getLent, GetLent, LentItem } from "./getTransactions/lentTransactions";
import {
  getBorrowed,
  GetBorrowed,
  BorrowedItem,
} from "./getTransactions/borrowedTransactions";
import {
  getTransactions,
  GetTransactions,
} from "./getTransactions/allTransactions";
import { getPrice, GetPrice } from "./oTokenData/getPrice";
import { getInfo, GetInfo, GetInfoRes } from "./oTokenData/getInfo";
import { transfer, Transfer, TransferRes } from "./utils/transfer";
import { getConfig, GetConfig, GetConfigRes } from "./oTokenData/getConfig";
import {
  getPosition,
  GetPosition,
  GetPositionRes,
} from "./oTokenData/getPosition";
import {
  getBalances,
  GetBalances,
  GetBalancesRes,
} from "./oTokenData/getBalances";
import { getAllPositions, GetAllPositions, GetAllPositionsRes } from "./protocolData/getAllPositions";
// LO helpful data
import { oTokens, tokens } from "./ao/processData";
// AO misc types/functions
import { connectToAO } from "./ao/connect";
import { Services } from "@permaweb/aoconnect/dist/index.common";
import { SpawnProcess } from "@permaweb/aoconnect/dist/lib/spawn";
import { SendMessage } from "@permaweb/aoconnect/dist/lib/message";
import { ReadResult } from "@permaweb/aoconnect/dist/lib/result";
import { SendMessageRes } from "./ao/sendMessage";
import { Transaction } from "./arweave/getTags";
// AO helpful functions
import { createDataItemSigner as createDataItemSignerNode } from "@permaweb/aoconnect/dist/client/node/wallet";
import { createDataItemSigner as createDataItemSignerWeb } from "@permaweb/aoconnect/browser";

export interface aoUtils {
  spawn: SpawnProcess;
  message: SendMessage;
  result: ReadResult;
  signer: typeof createDataItemSignerNode | typeof createDataItemSignerWeb;
}

class LiquidOps {
  private aoUtils: aoUtils;

  constructor(
    signer: typeof createDataItemSignerNode | typeof createDataItemSignerWeb,
    configs: Services = {},
  ) {
    if (!signer) {
      throw new Error("Please specify a ao createDataItemSigner signer");
    }

    const { spawn, message, result } = connectToAO(configs);
    this.aoUtils = {
      spawn,
      message,
      result,
      signer,
    };
  }

  // lend

  async lend(params: Lend): Promise<SendMessageRes> {
    return lend(this.aoUtils, params);
  }

  async unLend(params: UnLend): Promise<SendMessageRes> {
    return unLend(this.aoUtils, params);
  }

  // borrow

  async borrow(params: Borrow): Promise<SendMessageRes> {
    return borrow(this.aoUtils, params);
  }

  async repay(params: Repay): Promise<SendMessageRes> {
    return repay(this.aoUtils, params);
  }

  async payInterest(params: PayInterest): Promise<SendMessageRes> {
    return payInterest(this.aoUtils, params);
  }

  // oTokenData

  async getAPY(params: GetAPY): Promise<number> {
    return getAPY(this.aoUtils, params);
  }

  async getBalance(params: GetBalance): Promise<number> {
    return getBalance(this.aoUtils, params);
  }

  async getPrice(params: GetPrice): Promise<number> {
    return getPrice(this.aoUtils, params);
  }

  async getInfo(params: GetInfo): Promise<GetInfoRes> {
    return getInfo(this.aoUtils, params);
  }

  async getReserves(params: GetReserves): Promise<GetReservesRes> {
    return getReserves(this.aoUtils, params);
  }

  async getConfig(params: GetConfig): Promise<GetConfigRes> {
    return getConfig(this.aoUtils, params);
  }

  async getPosition(params: GetPosition): Promise<GetPositionRes> {
    return getPosition(this.aoUtils, params);
  }

  async getBalances(params: GetBalances): Promise<GetBalancesRes> {
    return getBalances(this.aoUtils, params);
  }

  // position data

  async getLent(params: GetLent): Promise<LentItem[]> {
    return getLent(params);
  }

  async getBorrowed(params: GetBorrowed): Promise<BorrowedItem[]> {
    return getBorrowed(params);
  }

  async getTransactions(params: GetTransactions): Promise<Transaction[]> {
    return getTransactions(params);
  }

  // utils

  async transfer(params: Transfer): Promise<TransferRes> {
    return transfer(this.aoUtils, params);
  }

  // protocol data

  async getAllPositions(params: GetAllPositions): Promise<GetAllPositionsRes> {
    return getAllPositions(this.aoUtils, params);
  }

  // process data

  static oTokens = oTokens;
  static tokens = tokens;
}

export { createDataItemSignerNode, createDataItemSignerWeb };
export default LiquidOps;
