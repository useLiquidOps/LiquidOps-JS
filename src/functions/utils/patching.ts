export default class Patching {
  #hbNode: string;

  constructor(node = "https://state-2.forward.computer") {
    this.#hbNode = node;
  }

  async compute<Process extends string, Path extends string, Config extends GetPatchConfig>(process: Process, path: Path, config?: Config) {
    return await this.#get<Process, Path, Config>(
      process,
      path,
      "compute",
      config
    );
  }

  async now<Process extends string, Path extends string, Config extends GetPatchConfig>(process: Process, path: Path, config?: Config) {
    return await this.#get<Process, Path, Config>(
      process,
      path,
      "now",
      config
    );
  }

  async #get<Process extends string, Path extends string, Config extends GetPatchConfig>(process: Process, path: Path, method: "now" | "compute", config?: Config): Promise<Config["json"] extends true ? PathValue<PatchState<Process>, Path> : string> {
    const searchParams = new URLSearchParams();

    if (config?.json) {
      searchParams.set("require-codec", "application/json");
      searchParams.set("accept-bundle", "true");
    }

    const url = new URL(
      `${process}~process@1.0/${method}/${path}?${searchParams.toString()}`,
      this.#hbNode
    );

    const res = await fetch(url);

    if (config?.json) {
      const { body } = await res.json();

      return body;
    }

    // @ts-expect-error
    return await res.text();
  }
}

type PatchState<Process extends string> =
  Process extends "SmmMv0rJwfIDVM3RvY2-P729JFYwhdGSeGo2deynbfY" // controller
    ? PatchStateController
    : Process extends "R5rRjBFS90qIGaohtzd1IoyPwZD0qJZ25QXkP7_p5a0" // oracle
      ? PatchStateOracle
      : PatchStateoToken; // oTokens

type PathValue<T, Path extends string> =
  Path extends `/${infer Rest}`
    ? PathValue<T, Rest>
    : Path extends `${infer Key}/${infer SubPath}`
      ? Key extends keyof T
        ? PathValue<T[Key], SubPath>
        : never
      : Path extends keyof T
        ? T[Path]
        : never;

interface GetPatchConfig {
  json: boolean;
}

interface Friend {
  id: string;
  ticker: string;
  oToken: string;
  denomination: number;
}

export interface PatchStateoToken {
  "token-info": {
    name: string;
    ticker: string;
    logo: string;
    denomination: string;
    supply: string;
  };
  environment: {
    collateral: {
      id: string;
      denomination: number;
    };
    "risk-parameters": {
      "collateral-factor": number;
      "liquidation-threshold": number;
      "reserve-factor": number;
    };
    "limits": {
      "value-limit": string;
      "cooldown-period": number;
      "enabled-interactions": string[];
      "disabled-interactions": string[];
    };
    "oracle-parameters": {
      oracle: string;
      "oracle-delay-tolerance": number;
    };
    "interest-model": {
      rates: {
        init: number;
        base: number;
        jump: number;
      };
      "kink-param": number;
    };
    friends: Friend[];
  };
  "pool-state": {
    "total-borrows": string;
    cash: string;
    "total-reserves": string;
    utilization: string;
    rates: {
      borrow: string;
      supply: string;
    };
    "interest-accrual": {
      "borrow-index": string;
      "last-updated": number;
      "reserves-remainder": string;
    };
  };
  balances: Record<string, string>;
  cooldowns: Record<string, number>;
  positions: Record<string, {
    collateralization: string;
    capacity: string;
    borrowBalance: string;
    liquidationLimit: string;
  }>;
  loans: Record<string, string>;
  "interest-indices": Record<string, string>;
  orders: Record<string, {
    success: boolean;
    message?: string;
  }>;
}

interface PatchStateController {
  "token-info": {
    name: string;
  };
  oracle: string;
  "discount-config": {
    min: number;
    max: number;
    interval: number;
  };
  tokens: Friend[];
  queue: {
    address: string;
    origin: string;
  };
  auctions: Record<string, number>;
}

interface PatchStateOracle {
  "token-info": {
    name: string;
    version: string;
  };
  whitelist: string[];
  relayers: string[];
  prices: Record<number, {
    price: number;
    timestamp: number;
  }>;
  price: Record<string, number>;
}
