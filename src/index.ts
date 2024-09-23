import { lend } from "./lend/lend";
import { unLend } from "./lend/unLend";
import { borrow } from "./borrow/borrow";
import { repay } from "./borrow/repay";
import { payInterest } from "./borrow/payInterest";
import { getAPY } from "./poolData/getAPY";
import { getBalance } from "./poolData/getBalance";
import { getLiquidity } from "./poolData/getLiquidity";
import { getLent } from "./positionData/getLent";
import { getBorrowed } from "./positionData/getBorrowed";
import { getTransactions } from "./positionData/getTransactions";
import { oTokens } from "./ao/processData";
import { createDataItemSigner as createDataItemSignerNode } from "@permaweb/aoconnect/dist/client/node/wallet";
import { createDataItemSigner as createDataItemSignerWeb } from "@permaweb/aoconnect/browser";

interface customConfigs {
  customGateway?: string;
  customSU?: string;
  customMU?: string;
  customCU?: string;
  tags?: Array<{ name: string; value: string }>;
}

class LiquidOps {
  private aoSigner: typeof createDataItemSignerNode | typeof createDataItemSignerWeb;
  private configs: customConfigs;

  constructor(signer: typeof createDataItemSignerNode | typeof createDataItemSignerWeb, configs: customConfigs = {}) {
    this.aoSigner = signer;
    this.configs = configs;
  }

  if (!this.signer) {
    throw new Error('Please specify a ao createDataItemSigner signer')
  }

  async lend(): Promise<any> {
    return lend(this.aoSigner, this.configs);
  }

  async unLend(): Promise<any> {
    return unLend(this.aoSigner, this.configs);
  }

  async borrow(): Promise<any> {
    return borrow(this.aoSigner, this.configs);
  }

  async repay(): Promise<any> {
    return repay(this.aoSigner, this.configs);
  }

  async payInterest(): Promise<any> {
    return payInterest(this.aoSigner, this.configs);
  }

  async getAPY(): Promise<number> {
    return getAPY(this.configs);
  }

  async getBalance(): Promise<number> {
    return getBalance(this.aoSigner, this.configs);
  }

  async getLiquidity(): Promise<number> {
    return getLiquidity(this.configs);
  }

  async getLent(): Promise<number> {
    return getLent(this.aoSigner, this.configs);
  }

  async getBorrowed(): Promise<number> {
    return getBorrowed(this.aoSigner, this.configs);
  }

  async getTransactions(): Promise<any[]> {
    return getTransactions(this.aoSigner, this.configs);
  }

  static oTokens = oTokens
}

export { createDataItemSignerNode, createDataItemSignerWeb };
export default LiquidOps;
