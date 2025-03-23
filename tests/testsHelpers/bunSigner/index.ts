import { createData } from "warp-arbundles";

import ArweaveSigner from "./signer";
import { JWKInterface } from "./jwk-interface";

const createDataItemSignerBun = (wallet: JWKInterface) => {
  const signer = ({ data, tags, target, anchor }: any) => {
    const signer = new ArweaveSigner(wallet);
    const dataItem = createData(data, signer, { tags, target, anchor });
    return dataItem.sign(signer).then(async () => ({
      id: await dataItem.id,
      raw: await dataItem.getRaw(),
    }));
  };

  return signer;
};

export default createDataItemSignerBun;
