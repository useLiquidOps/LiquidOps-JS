import { sendData } from "../../ao/messaging/sendData";
import { AoUtils, connectToAO } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface Transfer {
  token: TokenInput | string;
  recipient: string;
  quantity: BigInt;
}

export interface TransferRes {
  id: string;
  status: boolean;
}

export async function transfer(
  aoUtilsInput: Pick<AoUtils, "signer" | "configs">,
  { token, recipient, quantity }: Transfer,
): Promise<TransferRes> {
  try {
    if (!token || !recipient || !quantity) {
      throw new Error("Please specify a token, recipient and quantity.");
    }
    const { spawn, message, result } = await connectToAO(aoUtilsInput.configs);

    const aoUtils: AoUtils = {
      spawn,
      message,
      result,
      signer: aoUtilsInput.signer,
      configs: aoUtilsInput.configs,
    };

    const { tokenAddress } = tokenInput(token);

    const res = await sendData(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Recipient: recipient,
      Quantity: quantity.toString(),
    });

    const hasDebitNotice = res.Messages[0]?.Tags.some(
      (tag: { name: string; value: string }) =>
        tag.name === "Action" && tag.value === "Debit-Notice",
    );

    return {
      id: res.initialMessageID,
      status: hasDebitNotice,
    };
  } catch (error) {
    throw new Error("Error in transfer function: " + error);
  }
}
