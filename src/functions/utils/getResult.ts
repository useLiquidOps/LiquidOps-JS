import { validateTransaction } from "../../ao/messaging/validationUtils";
import { AoUtils, connectToAO } from "../../ao/utils/connect";
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
  aoUtilsInput: Pick<AoUtils, "signer" | "configs">,
  { transferID, tokenAddress, action }: GetResult,
): Promise<GetResultRes> {
  try {
    const { spawn, message, result } = await connectToAO(aoUtilsInput.configs);

    const aoUtils: AoUtils = {
      spawn,
      message,
      result,
      signer: aoUtilsInput.signer,
      configs: aoUtilsInput.configs,
    };

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

    const txResult = validateTransaction(
      aoUtils,
      transferID,
      tokenAddress,
      CONFIG,
    );

    return txResult;
  } catch (error) {
    throw new Error("Error in getResult function: " + error);
  }
}
