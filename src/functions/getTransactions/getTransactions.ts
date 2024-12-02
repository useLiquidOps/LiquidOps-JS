import { AoUtils } from "../../ao/connect";
import { TokenInput, tokenInput } from "../../ao/tokenInput";
import { getTags } from "../../arweave/getTags";
import { GQLTransactionsResultInterface as GetTransactionsRes } from "ar-gql/dist/faces";

export interface GetTransactions {
  token: "all" | TokenInput;
  action:
    | "all"
    | "borrow"
    | "payInterest"
    | "repay"
    | "lend"
    | "unLend"
    | "transfer";
  walletAddress: string;
  cursor?: string;
}

export async function getTransactions(
  aoUtils: AoUtils,
  { token, action, walletAddress, cursor = "1" }: GetTransactions,
): Promise<GetTransactionsRes> {
  try {
    if (!token || !action || !walletAddress) {
      throw new Error("Please specify a token, action and walletAddress.");
    }

    const tags = [{ name: "Protocol-Name", values: ["LiquidOps"] }];

    if (token !== "all") {
      const { tokenAddress } = tokenInput(token);
      tags.push({ name: "Target", values: [tokenAddress] });
    }

    if (action === "borrow") {
      tags.push({ name: "X-Action", values: ["Borrow"] });
    } else if (action === "payInterest") {
      tags.push({ name: "X-Action", values: ["Pay-Interest"] });
    } else if (action === "repay") {
      tags.push({ name: "X-Action", values: ["Repay"] });
    } else if (action === "lend") {
      tags.push({ name: "X-Action", values: ["Lend"] });
    } else if (action === "unLend") {
      tags.push({ name: "Action", values: ["Burn"] });
    } else if (action === "transfer") {
      tags.push({ name: "LO-Action", values: ["Transfer"] });
    } else if (action !== "all") {
      throw new Error("Please specify an action.");
    }

    const res = await getTags({ aoUtils, tags, walletAddress, cursor });

    return res;
  } catch (error) {
    throw new Error("Error in getTransactions function:" + error);
  }
}
