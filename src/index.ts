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
import { ArweaveSigner } from "arbundles";

interface customConfigs {
  customGateway?: string;
  customSU?: string;
  customMU?: string;
  customCU?: string;
  tags?: Array<{ name: string; value: string }>;
}

class LiquidOps {
  private signer: ArweaveSigner;
  private configs: customConfigs;

  constructor(signer: ArweaveSigner, configs: customConfigs = {}) {
    this.signer = signer;
    this.configs = configs;
  }

  if (!this.signer) {
    throw new Error('Please specify a arweave signer.')
  }

  async lend(): Promise<any> {
    return lend(this.signer, this.configs);
  }

  async unLend(): Promise<any> {
    return unLend(this.signer, this.configs);
  }

  async borrow(): Promise<any> {
    return borrow(this.signer, this.configs);
  }

  async repay(): Promise<any> {
    return repay(this.signer, this.configs);
  }

  async payInterest(): Promise<any> {
    return payInterest(this.signer, this.configs);
  }

  async getAPY(): Promise<number> {
    return getAPY(this.configs);
  }

  async getBalance(): Promise<number> {
    return getBalance(this.signer, this.configs);
  }

  async getLiquidity(): Promise<number> {
    return getLiquidity(this.configs);
  }

  async getLent(): Promise<number> {
    return getLent(this.signer, this.configs);
  }

  async getBorrowed(): Promise<number> {
    return getBorrowed(this.signer, this.configs);
  }

  async getTransactions(): Promise<any[]> {
    return getTransactions(this.signer, this.configs);
  }

  static oTokens = oTokens
}

export default { LiquidOps, ArweaveSigner };
