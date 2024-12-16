import { AoUtils } from "../../utils/connect";

export async function findCreditResult(
  aoUtils: AoUtils,
  creditID: string,
  recipientID: string,
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
        message: creditID,
        process: recipientID,
      });
      console.log(Messages, Spawns, Output, Error); // TODO: fix here
      const checkMintConfirmation = checkMintStatus(Messages);
      if (!checkMintConfirmation) {
        throw new Error(
          `Error checking mint confirmation, response: ${Messages} ${Spawns} ${Output} ${resultError} with ID ${creditID}`,
        );
      }
      break;
    } catch (error) {
      console.log(
        `Searching for credit result response: attempt ${attempt}/${maxRetries}`,
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

interface MintData {
  Target: string;
  Tags: {
    name: string;
    value: string;
  }[];
  Anchor: string;
}

function checkMintStatus(data: MintData[]): boolean {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  for (const item of data) {
    if (!Array.isArray(item.Tags)) {
      continue;
    }
    const actionTag = item.Tags.find((tag) => tag.name === "Action");

    if (!actionTag) {
      continue;
    }

    switch (actionTag.value) {
      case "Mint-Confirmation":
        return true;
      case "Mint-Error":
        return false;
      default:
        continue;
    }
  }

  return false;
}
