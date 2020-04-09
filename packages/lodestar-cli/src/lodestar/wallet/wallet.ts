import {Keypair} from "@chainsafe/bls";
import fs from "fs";

const home = process.env.HOME;
const walletsDir = [home, ".config", "lodestar", "wallets"].join("/");

if(!fs.existsSync(walletsDir)) {
  fs.mkdirSync(walletsDir, { recursive: true });
}

export async function listWallets(): Promise<Array<string>> {
  const files = await fs.promises.readdir(walletsDir);
  const filtered = files.filter((x) => x.startsWith("0x"));
  return filtered;
}

export function removeWallet(key: string) {
  const dir = walletsDir+"/"+key;
  if(fs.existsSync(dir)) {
    // Do important other cleanup
    fs.rmdirSync(dir)
  }
}

export function newWallet(): string {
  return "";
}
