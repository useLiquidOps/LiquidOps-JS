import { connect } from "@permaweb/aoconnect";
import { Services } from "@permaweb/aoconnect/dist/index.common";
import { SpawnProcess } from "@permaweb/aoconnect/dist/lib/spawn";
import { SendMessage } from "@permaweb/aoconnect/dist/lib/message";
import { ReadResult } from "@permaweb/aoconnect/dist/lib/result";
import { Types as aoconnectTypes } from "@permaweb/aoconnect/dist/dal";

export function connectToAO(services?: Services) {
  const {
    GRAPHQL_URL,
    GRAPHQL_MAX_RETRIES,
    GRAPHQL_RETRY_BACKOFF,
    GATEWAY_URL,
    MU_URL,
    CU_URL,
  } = services || {};

  const { spawn, message, result } = connect({
    GATEWAY_URL,
    GRAPHQL_URL,
    GRAPHQL_MAX_RETRIES,
    GRAPHQL_RETRY_BACKOFF,
    MU_URL,
    CU_URL,
  });

  return { spawn, message, result };
}

export interface aoUtils {
  spawn: SpawnProcess;
  message: SendMessage;
  result: ReadResult;
  signer: aoconnectTypes["signer"];
  configs: Services;
}
