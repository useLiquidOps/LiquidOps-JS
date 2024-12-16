import { getTags } from "../../../arweave/getTags";
import { AoUtils } from "../../utils/connect";
import { Tag } from "../../../arweave/getTags";

export async function findCDTxn(aoUtils: AoUtils, tags: Tag[]) {
  const maxRetries = 10;
  const attemptInterval = 6;

  let attempt = 1;
  let transactionsFound;
  while (attempt <= maxRetries) {
    transactionsFound = await getTags({
      aoUtils,
      tags,
      cursor: "",
    });
    if (transactionsFound?.edges?.length === 2) {
      break;
    }
    console.log(
      `Searching for credit/debit notice response: attempt ${attempt}/${maxRetries}`,
    );
    if (attempt < maxRetries) {
      await new Promise((resolve) =>
        setTimeout(resolve, attemptInterval * 1000),
      );
    } else {
      break;
    }
    attempt++;
  }
  if (transactionsFound?.edges.length !== 2) {
    throw new Error(
      `Unable to find messages via graphQL after ${maxRetries} attempts, response: ${JSON.stringify(transactionsFound)}`,
    );
  }
  const checkMintRes = validateMintRes(transactionsFound);
  if (!checkMintRes) {
    throw new Error(
      `Error checking mint response, transactions found: ${JSON.stringify(transactionsFound)}`,
    );
  }
  const debitID = transactionsFound.edges[0].node.id;
  const creditID = transactionsFound.edges[1].node.id;

  return { debitID, creditID };
}

interface Response {
  edges: {
    cursor: string;
    node: {
      id: string;
      tags: {
        value: string;
        name: string;
      }[];
    };
  }[];
  pageInfo: {
    hasNextPage: boolean;
  };
}

function validateMintRes(response: Response): boolean {
  if (response.edges.length !== 2) {
    return false;
  }

  const hasDebitNotice = response.edges.some((edge) =>
    edge.node.tags.some(
      (tag) => tag.name === "Action" && tag.value === "Debit-Notice",
    ),
  );

  const hasCreditNotice = response.edges.some((edge) =>
    edge.node.tags.some(
      (tag) => tag.name === "Action" && tag.value === "Credit-Notice",
    ),
  );

  return hasDebitNotice && hasCreditNotice;
}
