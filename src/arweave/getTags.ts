import { arGql } from "ar-gql";
import { AoUtils } from "../ao/utils/connect";
import { GQLTransactionsResultInterface } from "ar-gql/dist/faces";

export interface Tag {
  name: string;
  values: string | string[];
}

interface GetTags {
  aoUtils: AoUtils;
  tags: Tag[];
  cursor: string;
  owner?: string;
}

export async function getTags({
  aoUtils,
  tags,
  owner,
  cursor,
}: GetTags): Promise<GQLTransactionsResultInterface> {
  try {
    const gqlEndpoint =
      aoUtils.configs.GRAPHQL_URL ||
      "https://arweave-search.goldsky.com/graphql";
    const gql = arGql({ endpointUrl: gqlEndpoint });

    // Find and extract recipient tag if it exists
    const recipientTag = tags.find((tag) => tag.name === "recipient");
    const recipientValue = recipientTag
      ? Array.isArray(recipientTag.values)
        ? recipientTag.values[0]
        : recipientTag.values
      : undefined;
    const filteredTags = tags.filter((tag) => tag.name !== "recipient");

    const formattedTags = filteredTags.map((tag) => ({
      name: tag.name,
      values: Array.isArray(tag.values) ? tag.values : [tag.values],
    }));

    const query = `
      query GetTransactions(
        $tags: [TagFilter!],
        $cursor: String
        ${owner ? ", $owner: String!" : ""}
        ${recipientValue ? ", $recipients: [String!]" : ""}
      ) {
        transactions(
          tags: $tags
          ${owner ? "owners: [$owner]" : ""}
          ${recipientValue ? "recipients: $recipients" : ""}
          first: 100
          after: $cursor
          sort: HEIGHT_DESC
        ) {
          edges {
            cursor
            node {
              id
              tags {
                name
                value
              }
              block {
                  timestamp
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `;

    const variables = {
      tags: formattedTags,
      cursor: cursor || "",
      ...(owner && { owner }),
      ...(recipientValue && { recipients: [recipientValue] }),
    };

    const response = await gql.run(query, variables);

    // @ts-ignore
    if (response.errors?.[0]?.message === "internal server error") {
      throw new Error("GraphQL endpoint internal server error.");
    }

    return response.data.transactions;
  } catch (error) {
    throw new Error(`Failed to retrieve Arweave GraphQL data: ${error}`);
  }
}
