import { arGql } from "ar-gql";

export interface Transaction {
  id: string;
  tags: {
    name: string;
    value: string;
  }[];
}

export async function getTags(
  tags: { name: string; values: string | string[] }[],
  walletAddress: string,
): Promise<{ node: Transaction }[]> {
  try {
    const gql = arGql({endpointUrl: "https://arweave.net/graphql"});
    const query = `
    query GetTransactions($tags: [TagFilter!], $walletAddress: String!) {
      transactions(
        tags: $tags
        sort: HEIGHT_DESC
        first: 100
        owners:[$walletAddress]
      ) {
        edges {
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

    const response = await gql.run(query, { tags, walletAddress });
    return response.data.transactions.edges;
  } catch (error) {
    console.log(error);
    throw new Error("Error retrieving graphQL data");
  }
}
