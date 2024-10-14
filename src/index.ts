// LO functions
import { lend, Lend } from "./functions/lend/lend";
import { unLend, UnLend } from "./functions/lend/unLend";
import { borrow, Borrow } from "./functions/borrow/borrow";
import { repay, Repay } from "./functions/borrow/repay";
import { payInterest, PayInterest } from "./functions/borrow/payInterest";
import { getAPY, GetAPY } from "./functions/oTokenData/getAPY";
import { getBalance, GetBalance } from "./functions/utils/getBalance";
import {
  getReserves,
  GetReserves,
  GetReservesRes,
} from "./functions/oTokenData/getReserves";
import { getPrice, GetPrice } from "./functions/oTokenData/getPrice";
import { getInfo, GetInfo, GetInfoRes } from "./functions/oTokenData/getInfo";
import { transfer, Transfer, TransferRes } from "./functions/utils/transfer";
import { getConfig, GetConfig, GetConfigRes } from "./functions/oTokenData/getConfig";
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
import { oTokens, tokens } from "./ao/processData";
// AO misc types/functions
import { connectToAO } from "./ao/connect";
import { Services } from "@permaweb/aoconnect/dist/index.common";
import { SpawnProcess } from "@permaweb/aoconnect/dist/lib/spawn";
import { SendMessage } from "@permaweb/aoconnect/dist/lib/message";
import { ReadResult } from "@permaweb/aoconnect/dist/lib/result";
import { SendMessageRes } from "./ao/sendMessage";
// AO helpful functions
import { createDataItemSigner as createDataItemSignerNode } from "@permaweb/aoconnect/dist/client/node/wallet";
import { createDataItemSigner as createDataItemSignerWeb } from "@permaweb/aoconnect/browser";
import { Types as aoconnectTypes } from "@permaweb/aoconnect/dist/dal";

export interface aoUtils {
  spawn: SpawnProcess;
  message: SendMessage;
  result: ReadResult;
  signer: aoconnectTypes["signer"];
  configs: Services;
}

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

  async borrow(params: Borrow): Promise<SendMessageRes> {
    return borrow(this.aoUtils, params);
  }

  async payInterest(params: PayInterest): Promise<SendMessageRes> {
    return payInterest(this.aoUtils, params);
  }

  async repay(params: Repay): Promise<SendMessageRes> {
    return repay(this.aoUtils, params);
  }

  // lend

  async lend(params: Lend): Promise<SendMessageRes> {
    return lend(this.aoUtils, params);
  }

  async unLend(params: UnLend): Promise<SendMessageRes> {
    return unLend(this.aoUtils, params);
  }

  // oTokenData

  async getAPY(params: GetAPY): Promise<number> {
    return getAPY(this.aoUtils, params);
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

  async getPrice(params: GetPrice): Promise<number> {
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

  async getBalance(params: GetBalance): Promise<number> {
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
