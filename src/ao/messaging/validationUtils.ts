import { AoUtils } from "../../ao/utils/connect";
import { getTags } from "../../arweave/getTags";

interface Message {
  Tags: Tag[];
}

interface Tag {
  name: string;
  value: string;
}

interface Edge {
  node: {
    id: string;
    tags: Tag[];
  };
}

export interface TransactionResult {
  status: boolean | "pending";
  transferID: string;
  debitID?: string;
  creditID?: string;
  response?: string;
}

export interface FunctionConfig {
  action: string;
  expectedTxCount: number;
  confirmationTag: string;
  requiredNotices: string[];
  requiresCreditDebit: boolean;
}

async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 10,
  retryInterval = 600,
): Promise<T | "pending"> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) return "pending";
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
  return "pending";
}

export async function validateTransaction(
  aoUtils: AoUtils,
  transferID: string,
  targetProcessID: string,
  config: FunctionConfig,
  maxRetries = 10,
  retryInterval = 600,
): Promise<boolean | "pending"> {
  const result = await retryOperation(
    async () => {
      const { Messages } = await aoUtils.result({
        message: transferID,
        process: targetProcessID,
      });

      if (
        !Array.isArray(Messages) ||
        Messages.length !== config.expectedTxCount
      ) {
        throw new Error("Invalid transaction response");
      }

      const hasRequiredActions = config.requiredNotices.every(
        (notice: string) =>
          Messages.some((msg: Message) =>
            msg.Tags?.some(
              (tag: Tag) => tag.name === "Action" && tag.value === notice,
            ),
          ),
      );

      if (hasRequiredActions) return true;
      return false;
    },
    maxRetries,
    retryInterval,
  );

  return result === "pending" ? "pending" : !!result;
}

export async function findTransactionIds(
  aoUtils: AoUtils,
  transferID: string,
  processId: string,
  maxRetries = 10,
  retryInterval = 6000,
) {
  const result = await retryOperation(
    async () => {
      const transactionsFound = await getTags({
        aoUtils,
        tags: [
          { name: "Pushed-For", values: transferID },
          { name: "From-Process", values: processId },
        ],
        cursor: "",
      });

      if (!transactionsFound?.edges || transactionsFound.edges.length !== 2) {
        throw new Error("No transactions found or invalid count");
      }

      const debitTx = transactionsFound.edges.find((edge: Edge) =>
        edge.node.tags.some(
          (tag: Tag) => tag.name === "Action" && tag.value === "Debit-Notice",
        ),
      );

      const creditTx = transactionsFound.edges.find((edge: Edge) =>
        edge.node.tags.some(
          (tag: Tag) => tag.name === "Action" && tag.value === "Credit-Notice",
        ),
      );

      if (!debitTx || !creditTx) {
        throw new Error(
          "Missing required Debit-Notice or Credit-Notice transactions",
        );
      }

      return {
        debitID: debitTx.node.id,
        creditID: creditTx.node.id,
      };
    },
    maxRetries,
    retryInterval,
  );

  if (result === "pending") {
    throw new Error("Operation timed out");
  }

  return result;
}
