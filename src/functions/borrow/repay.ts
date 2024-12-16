import { sendTransaction } from "../../ao/messaging/sendTransaction";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

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

    const res = await sendTransaction(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Quantity: quantity.toString(),
      Recipient: oTokenAddress,
      "X-Action": "Repay",
      ...(onBehalfOf && { "X-On-Behalf": onBehalfOf }),
    });

    // @ts-ignore TODO
    return res;
  } catch (error) {
    throw new Error("Error in repay function:" + error);
  }
}
