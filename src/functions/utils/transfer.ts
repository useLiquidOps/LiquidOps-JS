import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface Transfer {
  token: TokenInput | string;
  recipient: string;
  quantity: BigInt;
}

export interface TransferRes {
  Target: string;
  Tags: {
    Action: "Debit-Notice" | "Transfer-Error";
    Recipient?: string;
    Quantity?: string;
    "Message-Id"?: string;
    Error?: string;
  };
}

export async function transfer(
  aoUtils: AoUtils,
  { token, recipient, quantity }: Transfer,
): Promise<TransferRes> {
  try {

    if (!token || !recipient || !quantity) {
      throw new Error("Please specify a token, recipient and quantity.");
    }


    let tokenAddress: string;

    try {
      const { tokenAddress: supportedTokenAddress } = tokenInput(
        token as TokenInput,
      );
      tokenAddress = supportedTokenAddress;
    } catch (error) {
      tokenAddress = token as string;
    }

    const res = await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Recipient: recipient,
      Quantity: quantity.toString(),
      "LO-Action": "Transfer", // for LO analytics
    });

    return res.Output; // TODO, make modular sendMessage response handling 
  } catch (error) {
    throw new Error("Error in transfer function: " + error);
  }
}
