import { Transaction } from "../arweave/getTags";

export interface GetBorrowed {
  borrowTransactions: Transaction[];
  repayTransactions: Transaction[];
}

export async function getBorrowed({
  borrowTransactions,
  repayTransactions,
}: GetBorrowed): Promise<loanItem[]> {
  const loanPromises = borrowTransactions.map(async (token) => {
    const ticker = token.tags.find(
      (tag) => tag.name === "borrowed-address",
    )?.value;
    const tokenItem = tokenInfo.find((token) => token.name === ticker);
    let balance = token.tags.find(
      (tag) => tag.name === "borrowed-quantity",
    )?.value;
    const timestamp = token.tags.find((tag) => tag.name === "timestamp")?.value;
    const repayments = repayTransactions.filter(
      (repay) =>
        repay.tags.find((tag) => tag.name === "Borrow-Id")?.value === token.id,
    );
    repayments.forEach((repay) => {
      const repayAmount = repay.tags.find(
        (tag) => tag.name === "borrowed-quantity",
      )?.value;
      if (balance && repayAmount) {
        balance = (parseInt(balance) - parseInt(repayAmount)).toString();
      }
    });

    if (balance && parseInt(balance) <= 0) {
      return undefined;
    }

    return {
      balance,
      timestamp,
      iconPath: tokenItem?.iconPath,
      ticker: tokenItem?.ticker,
      name: tokenItem?.name,
      ...token,
    };
  });

  const results = await Promise.all(loanPromises);
  return results.filter((loan): loan is loanItem => loan !== undefined);
}
export interface loanItem extends Transaction {
  balance: string;
  timestamp: string;
  iconPath: string;
  ticker: string;
  name: string;
}
