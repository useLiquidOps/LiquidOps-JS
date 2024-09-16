import { Lend, LendRes } from "../../types/lend/lend";

export async function lend({ number }: Lend): Promise<LendRes> {
  return { number };
}
