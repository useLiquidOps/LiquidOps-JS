import { getData } from "../../ao/messaging/getData";
import { AoUtils } from "../../ao/utils/connect";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";

export interface GetHistoricalAPR {
  token: TokenInput;
  fillGaps?: boolean;
}

export interface GetHistoricalAPRRes {
  apr: number;
  timestamp: number;
}

export async function getHistoricalAPR(
  aoUtils: AoUtils,
  { token, fillGaps = true }: GetHistoricalAPR,
): Promise<GetHistoricalAPRRes[]> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const response = await getData({
      Target: "D3AlSUAtbWKcozsrvckRuCY6TVkAY1rWtLYGoGf6KIA", // APR Agent address
      Action: "Get-Data",
      Token: oTokenAddress,
      "Fill-Gaps": fillGaps.toString(),
    });

    if (!response.Messages?.[0]?.Data) {
      throw new Error("No historical APR data received");
    }

    return JSON.parse(response.Messages[0].Data);
  } catch (error) {
    throw new Error("Error in getAPR function: " + error);
  }
}
