import { validateTransaction } from "../../ao/messaging/validationUtils";
import { AoUtils } from "../../ao/utils/connect";
import { LEND_CONFIG } from "../lend/lend";
import { UNLEND_CONFIG } from "../lend/unLend";
import { BORROW_CONFIG } from "../borrow/borrow";
import { REPAY_CONFIG } from "../borrow/repay";

export interface GetResult {
  transferID: string;
  tokenAddress: string;
  action: "lend" | "unLend" | "borrow" | "repay";
}

export type GetResultRes = boolean | "pending";

export type WithResultOption<T> = ({ noResult?: true } | { noResult?: false }) &
  T;

export async function getResult(
  aoUtils: AoUtils,
  { transferID, tokenAddress, action }: GetResult,
): Promise<GetResultRes> {
  try {
    let CONFIG;
    if (action === "lend") {
      CONFIG = LEND_CONFIG;
    } else if (action === "unLend") {
      CONFIG = UNLEND_CONFIG;
    } else if (action === "borrow") {
      CONFIG = BORROW_CONFIG;
    } else {
      CONFIG = REPAY_CONFIG;
    }

    const result = validateTransaction(
      aoUtils,
      transferID,
      tokenAddress,
      CONFIG,
    );

    return result;
  } catch (error) {
    throw new Error("Error in getResult function: " + error);
  }
}
