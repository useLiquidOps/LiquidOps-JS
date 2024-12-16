import { AoUtils } from "../../utils/connect";

export async function checkTransfer(
  aoUtils: AoUtils,
  transferID: string,
  targetProcessID: string,
) {
  const maxRetries = 10;
  const attemptInterval = 6;

  let attempt = 1;
  while (attempt <= maxRetries) {
    try {
      const {
        Messages,
        Spawns,
        Output,
        Error: resultError,
      } = await aoUtils.result({
        message: transferID,
        process: targetProcessID,
      });

      const checkTransferResultMessages = validateTransferRes(Messages);
      if (!checkTransferResultMessages) {
        throw new Error(`Error found in transfer result response.`);
      }
      break;
    } catch (error) {
      console.log(
        `Searching for transfer response: attempt ${attempt}/${maxRetries}`,
      );
      if (attempt === maxRetries) {
        return "pending";
      }
      await new Promise((resolve) =>
        setTimeout(resolve, attemptInterval * 1000),
      );
      attempt++;
    }
  }
}

interface Transaction {
  Anchor: string;
  Target: string;
  Tags: {
    value: string;
    name: string;
  }[];
  Data: string;
}

function validateTransferRes(transactions: Transaction[]): boolean {
  if (transactions.length !== 2) return false;

  const hasDebit = transactions.some((tx) =>
    tx.Tags.some(
      (tag) => tag.name === "Action" && tag.value === "Debit-Notice",
    ),
  );

  const hasCredit = transactions.some((tx) =>
    tx.Tags.some(
      (tag) => tag.name === "Action" && tag.value === "Credit-Notice",
    ),
  );

  return hasDebit && hasCredit;
}
