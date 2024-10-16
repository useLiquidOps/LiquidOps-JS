import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface Repay {
  token: TokenInput;
  quantity: BigInt;
}

export interface RepayRes {
  Target: string;
  Tags: {
    Action: "Repay-Confirmation" | "Repay-Error";
    "Repaid-Quantity"?: string;
    "Refund-Quantity"?: string;
    Error?: string;
  };
  Data?: string;
}

export async function repay(
  aoUtils: AoUtils,
  { token, quantity }: Repay,
): Promise<RepayRes> {
  try {
    const { tokenAddress, oTokenAddress } = tokenInput(token);

    const res: SendMessageRes = await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Quantity: JSON.stringify(quantity),
      Recipient: oTokenAddress,
      "X-Action": "Repay",
    });

    return res.Output;
  } catch (error) {
    throw new Error("Error in repay function:" + error);
  }
}
