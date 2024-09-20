import { sendMessage } from "../ao/sendMessage";

export async function getPoolLiquidity(poolID: string) {
  try {
    // const message = await sendMessage(
    //   poolID,
    //   {
    //     Target: poolID,
    //     Action: "Get-Reserve",
    //   },
    //   "",
    //   "Get-Reserve",
    //   poolID,
    // );
    // const totalLiquidity = message?.Messages[0].Tags.find(
    //   (token: any) => token.name === "Total",
    // );
    // return totalLiquidity.value;
    return 5.8;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting pool liquidity");
  }
}
