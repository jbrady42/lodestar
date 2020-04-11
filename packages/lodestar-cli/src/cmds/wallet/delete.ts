import {Argv, Arguments} from "yargs";
import {removeWallet} from "../../lodestar/wallet/wallet";


export const command = 'delete <key>';
export const desc = 'Delete wallet';
export function builder(yargs: Argv) {
  yargs.positional("key", {
    type: "string",
    desc: "Key to delete"
  })
}
export function handler(argv: any) {
  // TODO high level check if wallet exists
  const ok = removeWallet(argv.key);
  if(ok) {
    console.log("Wallet deleted");
  }
}
