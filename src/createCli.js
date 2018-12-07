// @flow
import { type CliDefinition, type CliOptions } from './types.flow';
import chooseCommand from './chooseCommand';
import runCommand from './runCommand';
import handleCliError from './handleCliError';

// Create a CLI application based on a set of command sand tasks
const createCli = ({ commands, tasks }: CliDefinition) => async (
  options: ?$Shape<CliOptions>,
) => {
  const opts = options || {};
  const argv = opts.argv || process.argv;
  // eslint-disable-next-line no-console
  const log = opts.log || console.log;

  let result;
  try {
    const [command, args] = await chooseCommand(commands, argv);
    result = await runCommand(command, tasks, args);
  } catch (error) {
    await handleCliError(error, log);
    throw error;
  }

  return result;
};

export default createCli;
