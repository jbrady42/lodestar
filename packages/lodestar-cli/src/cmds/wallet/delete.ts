import {removeWallet} from "../../lodestar/wallet/wallet";


export const command = 'delete <key>';
export const desc = 'Delete wallet';
export function builder(yargs: any) {
  yargs.positional("key", {
    type: "string",
    desc: "Key to delete"
  })
}
export function handler(argv: any) {
  removeWallet(argv.key);
  console.log("Wallet deleted");
}
