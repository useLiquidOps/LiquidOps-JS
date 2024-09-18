import { sendMessage } from "../ao/sendMessage";

export async function getAPY(poolID: string) {
  try {
    // const message = await sendMessage(
    //   poolID,
    //   {
    //     Target: poolID,
    //     Action: "Get-APY",
    //   },
    //   "",
    //   "Get-APY",
    //   poolID,
    // );
    // const APY = message?.Messages[0].Tags.find(
    //   (token: any) => token.name === "APY",
    // );
    // return APY.value / 100;
    return 4.75;
  } catch (error) {
    console.log(error);

    throw new Error("Error getting pool APY");
  }
}
