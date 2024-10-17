import { sendMessage, SendMessageRes } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface Repay {
  token: TokenInput;
  quantity: BigInt;
  onBehalfOf?: string;
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
  { token, quantity, onBehalfOf }: Repay,
): Promise<RepayRes> {
  try {
    if (!token || !quantity) {
      throw new Error("Please specify a token and quantity.");
    }

    const { tokenAddress, oTokenAddress } = tokenInput(token);

    const res = await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Quantity: quantity.toString(),
      Recipient: oTokenAddress,
      "X-Action": "Repay",
      ...(onBehalfOf && { "X-On-Behalf": onBehalfOf }),
    });

    return res.Output; // TODO, make modular sendMessage response handling
  } catch (error) {
    throw new Error("Error in repay function:" + error);
  }
}
