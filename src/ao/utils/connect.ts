import { connect } from "@permaweb/aoconnect";
type ConnectResult = ReturnType<typeof connect>;
type SpawnProcess = ConnectResult["spawn"];
type SendMessage = ConnectResult["message"];
type ReadResult = ConnectResult["result"];

const DEFAULT_SERVICES: Services = {
  MODE: "legacy",
  MU_URL: "https://mu.ao-testnet.xyz",
  CU_URL: "https://cu.ao-testnet.xyz",
  GATEWAY_URL: "https://arweave.net",
};

export async function connectToAO(services?: Partial<Services>) {
  const {
    MODE = DEFAULT_SERVICES.MODE,
    GRAPHQL_URL,
    GRAPHQL_MAX_RETRIES,
    GRAPHQL_RETRY_BACKOFF,
    GATEWAY_URL = DEFAULT_SERVICES.GATEWAY_URL,
    MU_URL = DEFAULT_SERVICES.MU_URL,
    CU_URL = DEFAULT_SERVICES.CU_URL,
  } = services || {};

  if (!connect) {
    throw new Error('Unable to connect to AO node, please refresh the page/session.');
  }

  const { spawn, message, result } = connect({
    // @ts-ignore, MODE is needed here but is not in the aoconnect type yet
    MODE,
    GATEWAY_URL,
    GRAPHQL_URL,
    GRAPHQL_MAX_RETRIES,
    GRAPHQL_RETRY_BACKOFF,
    MU_URL,
    CU_URL,
  });

  return { spawn, message, result };
}

export interface AoUtils {
  spawn: SpawnProcess;
  message: SendMessage;
  result: ReadResult;
  signer: any;
  configs: Services;
}

export type Services = {
  MODE?: "legacy" | "mainnet";
  GATEWAY_URL?: string;
  GRAPHQL_URL?: string;
  GRAPHQL_MAX_RETRIES?: number;
  GRAPHQL_RETRY_BACKOFF?: number;
  MU_URL?: string;
  CU_URL?: string;
};
