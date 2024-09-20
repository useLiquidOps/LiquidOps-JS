import { getPoolLiquidity } from "../poolData/getLiquidity";
import { tokenInfo } from "../ao/processInfo";

export async function getAllLiquidity(): Promise<liquidityItem[]> {
  const liquidityPromises = tokenInfo.map(async (token) => {
    const liquidity = await getPoolLiquidity(token.poolID);
    return {
      poolID: token.poolID,
      liquidity,
    };
  });

  const liquidityResults = await Promise.all(liquidityPromises);

  return liquidityResults;
}

export interface liquidityItem {
  poolID: string;
  liquidity: number;
}
