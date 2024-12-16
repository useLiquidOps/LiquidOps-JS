import { sendTransaction } from "../../ao/messaging/sendTransaction";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface Borrow {
  token: TokenInput;
  quantity: BigInt;
}

export interface BorrowRes {
  Target: string;
  Tags: {
    Action: "Borrow-Confirmation" | "Borrow-Error";
    "Borrowed-Quantity"?: string;
  };
  Data?: string;
}

export async function borrow(
  aoUtils: AoUtils,
  { token, quantity }: Borrow,
): Promise<BorrowRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { oTokenAddress } = tokenInput(token);

    const res = await sendTransaction(aoUtils, {
      Target: oTokenAddress,
      Action: "Borrow",
      Quantity: quantity.toString(),
    });

    // @ts-ignore TODO
    return res;
  } catch (error) {
    throw new Error("Error in borrow function:" + error);
  }
}
