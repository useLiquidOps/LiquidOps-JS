// LO functions
import { lend, Lend } from "./lend/lend";
import { unLend, UnLend } from "./lend/unLend";
import { borrow, Borrow } from "./borrow/borrow";
import { repay, Repay } from "./borrow/repay";
import { payInterest, PayInterest } from "./borrow/payInterest";
import { getAPY, GetAPY } from "./poolData/getAPY";
import { getBalance, GetBalance } from "./poolData/getBalance";
import { getLiquidity, GetLiquidity } from "./poolData/getLiquidity";
import { getLent, GetLent, LentItem } from "./positionData/getLent";
import { getBorrowed, GetBorrowed, BorrowedItem } from "./positionData/getBorrowed";
import {
  getTransactions,
  GetTransactions,
} from "./positionData/getTransactions";
// LO helpful data
import { oTokens } from "./ao/processData";
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

  async lend(params: Lend): Promise<SendMessageRes> {
    return lend(this.aoUtils, params);
  }

  async unLend(params: UnLend): Promise<SendMessageRes> {
    return unLend(this.aoUtils, params);
  }

  async borrow(params: Borrow): Promise<SendMessageRes> {
    return borrow(this.aoUtils, params);
  }

  async repay(params: Repay): Promise<SendMessageRes> {
    return repay(this.aoUtils, params);
  }

  async payInterest(params: PayInterest): Promise<SendMessageRes> {
    return payInterest(this.aoUtils, params);
  }

  async getAPY(params: GetAPY): Promise<number> {
    return getAPY(this.aoUtils, params);
  }

  async getBalance(params: GetBalance): Promise<number> {
    return getBalance(params);
  }

  async getLiquidity(params: GetLiquidity): Promise<number> {
    return getLiquidity(this.aoUtils, params);
  }

  async getLent(params: GetLent): Promise<LentItem[]> {
    return getLent(params);
  }

  async getBorrowed(params: GetBorrowed): Promise<BorrowedItem[]> {
    return getBorrowed(params);
  }

  async getTransactions(params: GetTransactions): Promise<Transaction[]> {
    return getTransactions(params);
  }

  static oTokens = oTokens;
}

export { createDataItemSignerNode, createDataItemSignerWeb };
export default LiquidOps;
