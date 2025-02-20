/**
 * @module cli/commands
 */
import {CommanderStatic} from "commander";
import {ICliCommand} from "./interface";
import {ILogger, WinstonLogger} from "@chainsafe/lodestar-utils/lib/logger";
import {generateCommanderOptions, optionsToConfig} from "../util";
import {IValidatorClientOptions} from "@chainsafe/lodestar/lib/validator/options";
import {ValidatorClient} from "@chainsafe/lodestar/lib/validator/nodejs";
import {validatorClientCliConfiguration} from "../lodestar/validator/options";

interface IValidatorCommandOptions {
  [key: string]: string;
  logLevel: string;
}

export class ValidatorCommand implements ICliCommand {

  public register(commander: CommanderStatic): void {
    const logger = new WinstonLogger();
    const command = commander
      .command("validator")
      .description("Start lodestar validator")
      .action(async (options) => {
        // library is not awaiting this method so don't allow error propagation
        // (unhandled promise rejections)
        try {
          await this.action(options, logger);
        } catch (e) {
          logger.error(e.message + "\n" + e.stack);
        }
      });
    generateCommanderOptions(command, validatorClientCliConfiguration);
  }

  public async action(options: IValidatorCommandOptions, logger: ILogger): Promise<void> {
    const conf: Partial<IValidatorClientOptions> = optionsToConfig(options, validatorClientCliConfiguration);
    const validator = new ValidatorClient(conf, {logger});
    await validator.start();
  }

}
