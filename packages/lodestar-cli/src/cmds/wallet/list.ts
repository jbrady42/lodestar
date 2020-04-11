import {listWallets} from "../../lodestar/wallet/wallet";

export const command = 'list';
export const desc = 'List wallets';
export const builder = {};

export async function handler() {
  const wallets = await listWallets();

  if(wallets.length > 0) {
    console.log("Listing wallets:\n")
    for(const i in wallets) {
      const wallet = wallets[i];
      console.log(`key: ${wallet}`);
    }
  } else {
    console.log("No wallets found")
  }
}
