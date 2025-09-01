import { getData } from "../../ao/messaging/getData";
import { TokenInput, tokenInput } from "../../ao/utils/tokenInput";
import { APRAgentAddress } from "../../ao/utils/tokenAddressData";
import { Services } from "../../ao/utils/connect";

export interface GetHistoricalAPR {
  token: TokenInput;
  fillGaps?: boolean;
}

export type GetHistoricalAPRRes = APR[];

interface APR {
  apr: number;
  timestamp: number;
}

export async function getHistoricalAPR(
  { token, fillGaps = true }: GetHistoricalAPR,
  config?: Services,
): Promise<GetHistoricalAPRRes> {
  try {
    if (!token) {
      throw new Error("Please specify a token.");
    }

    const { oTokenAddress } = tokenInput(token);

    const response = await getData(
      {
        Target: APRAgentAddress,
        Action: "Get-Data",
        Token: oTokenAddress,
        "Fill-Gaps": fillGaps.toString(),
      },
      config,
    );

    if (!response.Messages?.[0]?.Data) {
      const errorTag = response.Messages[0].Tags.find(
        (tag: { name: string; value: string }) => tag.name === "Error",
      );
      if (errorTag.value === "No data about this market") {
        return [
          {
            apr: 0,
            timestamp: Date.now(),
          },
        ];
      } else {
        throw new Error("No historical APR data received");
      }
    }

    return JSON.parse(response.Messages[0].Data);
  } catch (error) {
    throw new Error("Error in getHistoricalAPR function: " + error);
  }
}
