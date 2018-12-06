import chooseCommand from './chooseCommand';
import runCommand from './runCommand';
import handleCliError from './handleCliError';

// Create a CLI application based on a set of command sand tasks
const createCli = ({ commands, tasks } = {}) => async ({
  argv = process.argv,
  log = console.log,
} = {}) => {
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
