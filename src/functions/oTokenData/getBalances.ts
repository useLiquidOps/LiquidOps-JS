import { sendMessage } from "../../ao/sendMessage";
import { aoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetBalances {
  token: TokenInput;
}

export interface GetBalancesRes {
  // TODO
}

export async function getBalances(
  aoUtils: aoUtils,
  { token }: GetBalances,
): Promise<GetBalancesRes> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Balances",
    });
    const res = message.Messages[0].Tags.find(
      (tag: { name: string; value: string }) => tag.name === "Balances",
    );
    return res.value;
  } catch (error) {
    throw new Error("Error in getBalances function:" + error);
  }
}
