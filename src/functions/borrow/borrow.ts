import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

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
  { token, quantity }: Borrow
): Promise<BorrowRes> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const res = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Borrow",
      Quantity: quantity.toString(), // TODO, change this everywhere for .toString()
    });

    return res.Output;
  } catch (error) {
    throw new Error("Error in borrow function:" + error);
  }
}
