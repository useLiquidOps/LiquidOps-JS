import { SpawnProcess } from "@permaweb/aoconnect/dist/lib/spawn";
import { SendMessage } from "@permaweb/aoconnect/dist/lib/message";
import { ReadResult } from "@permaweb/aoconnect/dist/lib/result";
import { Types as AoConnectTypes } from "@permaweb/aoconnect/dist/dal";
import * as aoConnect from "@permaweb/aoconnect";
import { ReadResults } from "@permaweb/aoconnect/dist/lib/results";

const DEFAULT_SERVICES: Services = {
  MODE: "legacy",
  MU_URL: "https://mu.ao-testnet.xyz",
  CU_URL: "https://cu.ao-testnet.xyz",
  GATEWAY_URL: "https://arweave.net",
};

export function connectToAO(services?: Partial<Services>) {
  const {
    MODE = DEFAULT_SERVICES.MODE,
    GRAPHQL_URL,
    GRAPHQL_MAX_RETRIES,
    GRAPHQL_RETRY_BACKOFF,
    GATEWAY_URL = DEFAULT_SERVICES.GATEWAY_URL,
    MU_URL = DEFAULT_SERVICES.MU_URL,
    CU_URL = DEFAULT_SERVICES.CU_URL,
  } = services || {};

  const { spawn, message, result, results } = aoConnect.connect({
    // @ts-ignore, MODE is needed here but is not in the aoconnect type yet
    MODE,
    GATEWAY_URL,
    GRAPHQL_URL,
    GRAPHQL_MAX_RETRIES,
    GRAPHQL_RETRY_BACKOFF,
    MU_URL,
    CU_URL,
  });

  return { spawn, message, result, results };
}

export interface AoUtils {
  spawn: SpawnProcess;
  message: SendMessage;
  result: ReadResult;
  results: ReadResults;
  signer: AoConnectTypes["signer"];
  configs: Services;
}

export type Services = {
  /**
   * - the mode to connect to ao ("legacy" or "mainnet")
   */
  MODE?: "legacy" | "mainnet";
  /**
   * - the url of the desried Gateway.
   */
  GATEWAY_URL?: string;
  /**
   * - the url of the desired Arweave Gateway GraphQL Server
   */
  GRAPHQL_URL?: string;
  /**
   * - the number of times to retry querying the gateway, utilizing an exponential backoff
   */
  GRAPHQL_MAX_RETRIES?: number;
  /**
   * - the initial backoff, in milliseconds (moot if GRAPHQL_MAX_RETRIES is set to 0)
   */
  GRAPHQL_RETRY_BACKOFF?: number;
  /**
   * - the url of the desried ao Messenger Unit.
   */
  MU_URL?: string;
  /**
   * - the url of the desried ao Compute Unit.
   */
  CU_URL?: string;
};
