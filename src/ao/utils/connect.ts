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

export async function connectToAO(
  services?: Partial<Services>,
  maxRetries = 3,
  initialDelay = 1000,
) {
  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`AO connection attempt ${attempt}/${maxRetries}`);

      const {
        MODE = DEFAULT_SERVICES.MODE,
        GRAPHQL_URL,
        GRAPHQL_MAX_RETRIES,
        GRAPHQL_RETRY_BACKOFF,
        GATEWAY_URL = DEFAULT_SERVICES.GATEWAY_URL,
        MU_URL = DEFAULT_SERVICES.MU_URL,
        CU_URL = DEFAULT_SERVICES.CU_URL,
      } = services || {};

      const { spawn, message, result } = aoConnect.connect({
        // @ts-ignore, MODE is needed here but is not in the aoconnect type yet
        MODE,
        GATEWAY_URL,
        GRAPHQL_URL,
        GRAPHQL_MAX_RETRIES,
        GRAPHQL_RETRY_BACKOFF,
        MU_URL,
        CU_URL,
      });

      if (attempt !== 1) {
        console.log(`✅ AO connected successfully on attempt ${attempt}`);
      }

      return { spawn, message, result };
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      console.warn(`❌ Connection attempt ${attempt} failed:`, errorMessage);

      if (attempt < maxRetries) {
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 1.5;
      }
    }
  }

  throw new Error(
    `Failed to connect to AO after ${maxRetries} attempts. Last error: ${lastError?.message}`,
  );
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
