import { getTags } from "../arweave/getTags";
import { Transaction } from "../arweave/getTags";

export interface GetTransactions {
  poolID: string;
  poolTokenID?: string;
  walletAddress: string;
  action: "Borrow" | "Pay-Interest" | "Repay" | "Lend" | "Un-Lend";
}

export const getTransactions = async ({
  poolID,
  poolTokenID,
  walletAddress,
  action,
}: GetTransactions): Promise<Transaction[]> => {
  const tags = [
    { name: "Protocol-Name", values: "LiquidOps" },
    { name: "SDK", values: "aoconnect" },
  ];

  if (action === "Borrow" && poolTokenID) {
    tags.push({ name: "Target", values: poolTokenID });
    tags.push({ name: "Action", values: "Transfer" });
    tags.push({ name: "Recipient", values: poolID });
    tags.push({ name: "X-Action", values: "Borrow" });
  } else if (action === "Pay-Interest" && poolTokenID) {
    tags.push({ name: "Target", values: poolTokenID });
    tags.push({ name: "Action", values: "Transfer" });
    tags.push({ name: "Recipient", values: poolID });
    tags.push({ name: "X-Action", values: "Pay-Interest" });
  } else if (action === "Repay" && poolTokenID) {
    tags.push({ name: "Target", values: poolTokenID });
    tags.push({ name: "Action", values: "Transfer" });
    tags.push({ name: "Recipient", values: poolID });
    tags.push({ name: "X-Action", values: "Repay" });
  } else if (action === "Lend" && poolTokenID) {
    tags.push({ name: "Target", values: poolTokenID });
    tags.push({ name: "Action", values: "Transfer" });
    tags.push({ name: "Recipient", values: poolID });
    tags.push({ name: "X-Action", values: "Lend" });
  } else if (action === "Un-Lend") {
    tags.push({ name: "Target", values: poolID });
    tags.push({ name: "Action", values: "Burn" });
  }

  const getTagsReq = await getTags(tags, walletAddress);
  const transactions: Transaction[] = getTagsReq.map(({ node }) => node);
  const transactionIds: string[] = transactions.map(
    (transaction) => transaction.id,
  );

  const getMessageStatusReq = await getTags(
    [
      { name: "resultID", values: transactionIds },
      { name: "action", values: action },
    ],
    walletAddress,
  );
  const getMessageStatusReqTxns: Transaction[] = getMessageStatusReq.map(
    ({ node }) => node,
  );

  return combineTransactionsAndStatuses(transactions, getMessageStatusReqTxns);
};

function combineTransactionsAndStatuses(
  transactions: Transaction[],
  statusTransactions: Transaction[],
): Transaction[] {
  const statusTransactionsMap = new Map<string, Transaction>();
  statusTransactions.forEach((statusTransaction) => {
    const resultID = statusTransaction.tags.find(
      (tag) => tag.name === "resultID",
    )?.value;
    if (resultID) {
      statusTransactionsMap.set(resultID, statusTransaction);
    }
  });

  const combinedTransactions = transactions.map((transaction) => {
    const statusTransaction = statusTransactionsMap.get(transaction.id);
    if (statusTransaction) {
      const errorTag = statusTransaction.tags.find(
        (tag) => tag.name === "Error",
      );
      if (errorTag) {
        transaction.tags.push(errorTag);
      }
      const tickerTag = statusTransaction.tags.find(
        (tag) => tag.name === "tokenID",
      );
      if (tickerTag) {
        transaction.tags.push(tickerTag);
      }
    }
    return transaction;
  });

  combinedTransactions.sort((a, b) => {
    const timestampA = getTimestamp(a);
    const timestampB = getTimestamp(b);
    return timestampB - timestampA;
  });

  return combinedTransactions;
}

function getTimestamp(transaction: Transaction): number {
  const timestampTag = transaction.tags.find((tag) => tag.name === "timestamp");
  if (timestampTag) {
    return parseInt(timestampTag.value, 10);
  }
  return 0;
}
