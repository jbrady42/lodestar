import {listWallets} from "../../lodestar/wallet/wallet";


export const command = 'list';
export const desc = 'List wallets';
export const builder = {};

export async function handler(argv: any) {
  console.log("Listing wallets:\n")

  const wallets = await listWallets();
  for(const i in wallets) {
    const wallet = wallets[i];
    console.log(`key: ${wallet}`);
  }
}
