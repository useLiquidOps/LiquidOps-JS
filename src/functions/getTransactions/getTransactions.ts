import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import { getTags } from "../../arweave/getTags";

export interface GetTransactions {
  token: TokenInput;
  action: "lend" | "unLend" | "borrow" | "repay";
  walletAddress: string;
  cursor?: string;
}

export interface GetTransactionsRes {
  transactions: Transaction[];
  pageInfo: {
    hasNextPage: boolean;
    cursor?: string;
  };
}

export async function getTransactions(
  aoUtils: AoUtils,
  { token, action, walletAddress, cursor = "" }: GetTransactions,
): Promise<GetTransactionsRes> {
  try {
    if (!token || !action || !walletAddress) {
      throw new Error("Please specify a token, action and walletAddress.");
    }

    const tags = [{ name: "Protocol-Name", values: ["LiquidOps"] }];

    const { oTokenAddress, tokenAddress } = tokenInput(token);

    if (action === "borrow") {
      tags.push({ name: "recipient", values: [oTokenAddress] });
      tags.push({ name: "Action", values: ["Borrow"] });
      tags.push({ name: "Analytics-Tag", values: ["Borrow"] });
    } else if (action === "repay") {
      tags.push({ name: "recipient", values: [tokenAddress] });
      tags.push({ name: "Action", values: ["Transfer"] });
      tags.push({ name: "Recipient", values: [oTokenAddress] });
      tags.push({ name: "X-Action", values: ["Repay"] });
      tags.push({ name: "Analytics-Tag", values: ["Repay"] });
    } else if (action === "lend") {
      tags.push({ name: "recipient", values: [tokenAddress] });
      tags.push({ name: "Action", values: ["Transfer"] });
      tags.push({ name: "Recipient", values: [oTokenAddress] });
      tags.push({ name: "X-Action", values: ["Mint"] });
      tags.push({ name: "Analytics-Tag", values: ["Lend"] });
    } else if (action === "unLend") {
      tags.push({ name: "recipient", values: [oTokenAddress] });
      tags.push({ name: "Action", values: ["Redeem"] });
      tags.push({ name: "Analytics-Tag", values: ["UnLend"] });
    } else {
      throw new Error("Please specify an action.");
    }

    const queryArweave = await getTags({
      aoUtils,
      tags,
      owner: walletAddress,
      cursor,
    });

    return {
      transactions: processTransactions(queryArweave.edges),
      pageInfo: {
        hasNextPage: queryArweave.pageInfo.hasNextPage,
        cursor: queryArweave.edges[queryArweave.edges.length - 1]?.cursor,
      },
    };
  } catch (error) {
    throw new Error("Error in getTransactions function:" + error);
  }
}

interface TransactionNode {
  id: string;
  tags: {
    name: string;
    value: string;
  }[];
  block: {
    timestamp: number;
  };
}

export interface Transaction {
  id: string;
  tags: Record<string, string>;
  block: {
    timestamp: number;
  };
}

function processTransactions(
  transactions: { node: TransactionNode }[],
): Transaction[] {
  return transactions.map(({ node }) => {
    const processedTransaction: Transaction = {
      id: node.id,
      tags: {},
      block: {
        timestamp: node?.block?.timestamp ?? 0,
      },
    };

    node.tags.forEach((tag) => {
      processedTransaction.tags[tag.name] = tag.value;
    });

    return processedTransaction;
  });
}
