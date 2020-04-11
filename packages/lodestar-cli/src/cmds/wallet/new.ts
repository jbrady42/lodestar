import {Argv, Arguments} from "yargs";
import {removeWallet} from "../../lodestar/wallet/wallet";


export const command = 'new';
export const desc = 'Create or Restore new wallet';

export function builder(yargs: Argv) {
  yargs
  .options({
    "m": {
      alias: ["mnem"],
      type: "string",
      desc: "Restore wallet from mnemonic",
      default: ""
    },
    "i": {
      alias: ["index"],
      type: "number",
      desc: "Validator index"
    }
  })
}

export function handler(argv: any) {
  console.log(argv);
  const restore = argv.menm.length > 0;
  // prompt for password
  // create keys
}
