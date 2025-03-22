import { getData } from "../../ao/messaging/getData";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import { APRAgentAddress } from "../../ao/utils/tokenAddressData";

export interface GetHistoricalAPR {
  token: TokenInput;
  fillGaps?: boolean;
}

export interface GetHistoricalAPRRes {
  apr: number;
  timestamp: number;
}

export async function getHistoricalAPR(
  { token, fillGaps = true }: GetHistoricalAPR,
): Promise<GetHistoricalAPRRes[]> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const response = await getData({
      Target: APRAgentAddress,
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
