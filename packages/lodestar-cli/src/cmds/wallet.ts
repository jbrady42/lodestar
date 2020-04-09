export const command = 'wallet <command>';

export const desc = 'Manage wallet keys';

export function builder(yargs: any) {
  return yargs.commandDir('wallet');
}

export function handler(argv: any) {}
