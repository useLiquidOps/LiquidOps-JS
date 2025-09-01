import { getData } from "../../ao/messaging/getData";
import { Services } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetBorrowAPR {
  token: TokenInput;
}

export type GetBorrowAPRRes = number;

export async function getBorrowAPR(
  { token }: GetBorrowAPR,
  config?: Services,
): Promise<GetBorrowAPRRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const checkDataRes = await getData(
      {
        Target: oTokenAddress,
        Action: "Get-APR",
      },
      config,
    );

    const tags = checkDataRes.Messages[0].Tags;
    const aprResponse: {
      "Annual-Percentage-Rate": string;
      "Rate-Multiplier": string;
    } = {
      "Annual-Percentage-Rate": "",
      "Rate-Multiplier": "",
    };

    tags.forEach((tag: { name: string; value: string }) => {
      if (
        tag.name === "Annual-Percentage-Rate" ||
        tag.name === "Rate-Multiplier"
      ) {
        aprResponse[tag.name] = tag.value;
      }
    });

    const apr = parseFloat(aprResponse["Annual-Percentage-Rate"]);
    const rateMultiplier = parseFloat(aprResponse["Rate-Multiplier"]);

    return apr / rateMultiplier;
  } catch (error) {
    throw new Error("Error in getBorrowAPR function: " + error);
  }
}
