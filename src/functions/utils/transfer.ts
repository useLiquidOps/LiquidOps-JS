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

interface Tag {
  name: string;
  value: string;
}

export async function transfer(
  aoUtils: AoUtils,
  { token, recipient, quantity }: Transfer,
): Promise<TransferRes> {
  try {
    let tokenAddress: string;

    try {
      const { tokenAddress: supportedTokenAddress } = tokenInput(
        token as TokenInput,
      );
      tokenAddress = supportedTokenAddress;
    } catch (error) {
      tokenAddress = token as string;
    }

    const message = await sendMessage(aoUtils, {
      Target: tokenAddress,
      Action: "Transfer",
      Recipient: recipient,
      Quantity: quantity.toString(),
      "LO-Action": "Transfer",
    });

    const responseMessage = message.Messages[0];
    const tags: Tag[] = responseMessage.Tags;

    const transferRes: TransferRes = {
      Target: responseMessage.Target,
      Tags: {
        Action: "Debit-Notice",
      },
    };

    tags.forEach((tag: Tag) => {
      switch (tag.name) {
        case "Action":
          if (tag.value === "Transfer-Error") {
            transferRes.Tags.Action = "Transfer-Error";
          }
          break;
        case "Recipient":
          transferRes.Tags.Recipient = tag.value;
          break;
        case "Quantity":
          transferRes.Tags.Quantity = tag.value;
          break;
        case "Message-Id":
          transferRes.Tags["Message-Id"] = tag.value;
          break;
        case "Error":
          transferRes.Tags.Error = tag.value;
          break;
      }
    });

    return transferRes;
  } catch (error) {
    throw new Error("Error in transfer function: " + error);
  }
}
