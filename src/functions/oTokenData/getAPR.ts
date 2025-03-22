import { getData } from "../../ao/messaging/getData";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetAPR {
  token: TokenInput;
}

export interface APRResponse {
  "Annual-Percentage-Rate": string;
  "Rate-Multiplier": string;
}

export async function getAPR({ token }: GetAPR): Promise<number> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const checkDataRes = await getData({
      Target: oTokenAddress,
      Action: "Get-APR",
    });

    const tags = checkDataRes.Messages[0].Tags;
    const aprResponse: APRResponse = {
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
    throw new Error("Error in getAPR function: " + error);
  }
}
