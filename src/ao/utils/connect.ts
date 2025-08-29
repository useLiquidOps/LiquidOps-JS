import { connect } from "@permaweb/aoconnect";

// Create a helper function that returns the legacy connect result
const legacyConnect = () => connect({ MODE: "legacy" });

// Fix the type to always be legacy mode
type LegacyConnectResult = ReturnType<typeof legacyConnect>;
type SpawnProcess = LegacyConnectResult["spawn"];
type SendMessage = LegacyConnectResult["message"];
type ReadResult = LegacyConnectResult["result"];

export type Services = {
  GATEWAY_URL?: string;
  GRAPHQL_URL?: string;
  GRAPHQL_MAX_RETRIES?: number;
  GRAPHQL_RETRY_BACKOFF?: number;
  MU_URL?: string;
  CU_URL?: string;
};

export interface AoUtils {
  spawn: SpawnProcess;
  message: SendMessage;
  result: ReadResult;
  signer: any;
  configs: Services;
}

const DEFAULT_SERVICES: Services = {
  MU_URL: "https://mu.ao-testnet.xyz",
  CU_URL: "https://cu.ao-testnet.xyz",
  GATEWAY_URL: "https://arweave.net",
};

export function connectToAO(services?: Partial<Services>) {
  if (!connect) {
    throw new Error(
      "Unable to connect to AO node, please refresh the page/session.",
    );
  }

  const {
    GRAPHQL_URL,
    GRAPHQL_MAX_RETRIES,
    GRAPHQL_RETRY_BACKOFF,
    GATEWAY_URL = DEFAULT_SERVICES.GATEWAY_URL,
    MU_URL = DEFAULT_SERVICES.MU_URL,
    CU_URL = DEFAULT_SERVICES.CU_URL,
  } = services || {};

  const configs = {
    GATEWAY_URL,
    GRAPHQL_URL,
    GRAPHQL_MAX_RETRIES,
    GRAPHQL_RETRY_BACKOFF,
    MU_URL,
    CU_URL,
  };

  const { spawn, message, result, dryrun } = connect({
    MODE: "legacy",
    ...configs,
  }) as LegacyConnectResult;

  return { spawn, message, result, configs, dryrun };
}
