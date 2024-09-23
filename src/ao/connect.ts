import { connect } from "@permaweb/aoconnect";
import { Services } from "@permaweb/aoconnect/dist/index.common";

export function connectToAO(services?: Services) {
    const {
        GRAPHQL_URL,
        GRAPHQL_MAX_RETRIES,
        GRAPHQL_RETRY_BACKOFF,
        GATEWAY_URL,
        MU_URL,
        CU_URL
    } = services || {};

    const { spawn, message, result } = connect({
        GATEWAY_URL,
        GRAPHQL_URL,
        GRAPHQL_MAX_RETRIES,
        GRAPHQL_RETRY_BACKOFF,
        MU_URL,
        CU_URL
    });

    return { spawn, message, result };
}