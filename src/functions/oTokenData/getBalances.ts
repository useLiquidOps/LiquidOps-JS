import { sendMessage } from "../../ao/sendMessage";
import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";

export interface GetBalances {
  token: TokenInput;
}

export interface GetBalancesRes {
  [address: string]: BigInt;
}

export async function getBalances(
  aoUtils: AoUtils,
  { token }: GetBalances,
): Promise<GetBalancesRes> {
  try {
    const { oTokenAddress } = tokenInput(token);

    const message = await sendMessage(aoUtils, {
      Target: oTokenAddress,
      Action: "Balances",
    });

    if (!message.Messages[0].Data) {
      throw new Error("Balances data not found in the response");
    }

    const balancesData = JSON.parse(message.Messages[0].Data);

    const balances: GetBalancesRes = Object.entries(balancesData).reduce(
      (acc, [address, balance]) => {
        acc[address] = BigInt(balance as string);
        return acc;
      },
      {} as GetBalancesRes,
    );

    return balances;
  } catch (error) {
    throw new Error("Error in getBalances function: " + error);
  }
}
