// @flow
import { type CliDefinition, type CliOptions } from './types.flow';
import chooseCommand from './chooseCommand';
import runCommand from './runCommand';
import handleCliError from './handleCliError';

type CliOptionsInput = ?$Shape<CliOptions>;

export const parseOptions = (options: CliOptionsInput) => {
  const opts = options || {};
  const argv = opts.argv || process.argv;
  // eslint-disable-next-line no-console
  const log = opts.log || console.log;
  const shouldThrow = !!opts.shouldThrow;
  return { argv, log, shouldThrow };
};

/**
 * Creates a new CLI application based on a definition object.
 * @param definition
 */
export default async function createCli({
  name,
  commands,
  tasks,
}: CliDefinition) {
  const cliCommand = async (options: CliOptionsInput): * => {
    const { argv, log, shouldThrow } = parseOptions(options);

    let result;
    try {
      const [command, args] = await chooseCommand(commands, argv);
      result = await runCommand(command, tasks, args);
    } catch (error) {
      await handleCliError(error, log);
      if (shouldThrow) {
        throw error;
      }
    }

    return result;
  };

  if (name) {
    cliCommand.name = name;
  }

  return cliCommand;
}
