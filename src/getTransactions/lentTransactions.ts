import { Transaction } from "../arweave/getTags";

export interface GetLent {
  lendTransactions: Transaction[];
  unLendTransactions: Transaction[];
}

export interface LentItem {
  balance: string;
  iconPath: string;
  ticker: string;
  name: string;
  target: string;
}

export async function getLent({
  lendTransactions,
  unLendTransactions,
}: GetLent): Promise<LentItem[]> {
  let totalLendAmount = 0;
  let totalUnlendAmount = 0;

  lendTransactions.forEach((token) => {
    const lendAmount = token.tags.find((tag) => tag.name === "Quantity")?.value;
    if (lendAmount) {
      totalLendAmount += parseInt(lendAmount);
    }
  });

  unLendTransactions.forEach((token) => {
    const unLendAmount = token.tags.find(
      (tag) => tag.name === "Quantity",
    )?.value;
    if (unLendAmount) {
      totalUnlendAmount += parseInt(unLendAmount);
    }
  });

  const currentBalance = totalLendAmount - totalUnlendAmount;

  // @ts-ignore
  const tArToken = tokenInfo.find((token) => token.ticker === "tAR");
  if (tArToken && currentBalance > 0) {
    return [
      {
        balance: currentBalance.toString(),
        iconPath: tArToken.iconPath,
        ticker: tArToken.ticker,
        name: tArToken.name,
        target: tArToken.address,
      },
    ];
  }

  return [];
}
