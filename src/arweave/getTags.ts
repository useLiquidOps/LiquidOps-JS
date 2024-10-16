import { arGql } from "ar-gql";
import { AoUtils } from "../ao/connect";
import { GQLTransactionsResultInterface } from "ar-gql/dist/faces";

interface GetTags {
  aoUtils: AoUtils;
  tags: { name: string; values: string | string[] }[];
  walletAddress: string;
  cursor: string;
}

export async function getTags({
  aoUtils,
  tags,
  walletAddress,
  cursor,
}: GetTags): Promise<GQLTransactionsResultInterface> {
  try {
    const gqlEndpoint =
      aoUtils.configs.GRAPHQL_URL || "https://arweave.net/graphql";
    const gql = arGql({ endpointUrl: gqlEndpoint });
    const query = `
    query GetTransactions($cursor: String, $tags: [TagFilter!], $walletAddress: String!) {
      transactions(
        tags: $tags
        sort: HEIGHT_DESC
        after: $cursor
        first: 100
        owners:[$walletAddress]
      ) {
        edges {
          cursor
          node {
            id
            tags {
              name
              value
            }
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

    const response = await gql.run(query, { cursor, tags, walletAddress });
    return response.data.transactions;
  } catch (error) {
    console.log(error);
    throw new Error("Error retrieving arweave GraphQL data");
  }
}
