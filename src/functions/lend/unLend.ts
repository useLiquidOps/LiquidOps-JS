import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface UnLend {
  token: TokenInput;
  quantity: BigInt;
}

export interface UnLendRes {
  Target: string;
  Tags: {
    Action: "Redeem-Confirmation" | "Redeem-Error";
    "Earned-Quantity"?: string;
    "Burned-Quantity"?: string;
    "Refund-Quantity"?: string;
    Error?: string;
  };
  Data?: string;
}

export async function unLend(
  aoUtils: AoUtils,
  { token, quantity }: UnLend,
): Promise<UnLendRes> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const res: SendMessageRes = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Redeem",
      Quantity: quantity.toString(),
    });

    return res.Output;
  } catch (error) {
    throw new Error("Error in unLend function:" + error);
  }
}
