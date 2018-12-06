export class MissingCommandError extends Error {}
export class MissingTaskError extends Error {}
export class ArgumentValidationError extends Error {}
export class TaskExecutionError extends Error {}

export const parseArgv = x => x;

export const findCommand = (commands, commandName) => commands.find(({ id }) => id === commandName);

export const commandSelectionPrompt = async () => {};

export const argPrompt = async () => {};

export const validateArgs = async () => false;

export const interactiveSupported = () => process.isTTY;

export const chooseCommand = async (commands, argv) => {
  const [inputCommand, inputArgs] = parseArgv(commands, argv);
  const useInteractivePrompts = inputArgs.interactive != null ? inputArgs.interactive : interactiveSupported();

  let matchedCommand = findCommand(commands, inputCommand);
  while (!matchedCommand) {
    if (!useInteractivePrompts) {
      throw new MissingCommandError();
    } else {
      // eslint-disable-next-line no-await-in-loop
      matchedCommand = findCommand(commands, await commandSelectionPrompt(commands));
    }
  }

  let parsedArgs = inputArgs;
  let errors = await validateArgs(matchedCommand, parsedArgs);
  if (!useInteractivePrompts && errors) {
    throw new ArgumentValidationError(errors);
  }

  while (errors) {
    // eslint-disable-next-line no-await-in-loop
    parsedArgs = await argPrompt(matchedCommand, parsedArgs);
    // eslint-disable-next-line no-await-in-loop
    errors = await validateArgs(matchedCommand, parsedArgs);
  }

  return [matchedCommand, parsedArgs];
};

export const findTask = (tasks, taskName) => {
  const matchedTask = tasks.find(({ name }) => name === taskName);
  if (!matchedTask) {
    throw new MissingTaskError(taskName, tasks);
  }
  return matchedTask;
};

export const undoTask = async (task, args) => {
  if (!task.undo) {
    return;
  }
  await task.undo(task, args);
};

export const runTask = async (tasks, task, args) => {
  const childTasks = [];

  // Declare methods we will pass to our task runner method
  const actions = {
    childTask(childTaskName, childArgs) {
      const matched = findTask(tasks, childTaskName);
      const childTask = {
        task: matched,
        args: childArgs,
        promise: runTask(tasks, matched, childArgs),
      };
      childTasks.push(childTask);
    },
  };

  // Attempt to run the task
  try {
    return await task.run(args, actions);
  } catch (error) {
    // Undo all pending child tasks
    await Promise.all(
      childTasks.map(async ({ task: childTask, args: childArgs, promise }) => {
        // Try to let the current child complete first
        try {
          await promise;
        } catch (childError) {
          await undoTask(childTask, childArgs);
          throw childError;
        }
        await undoTask(childTask, childArgs);
      }),
    );

    // Undo the actual task
    await undoTask(task, args);

    // Throw the error on so
    throw error;
  }
};

export const runCommand = async ({ task: taskName }, tasks, args) => {
  const task = findTask(tasks, taskName);
  try {
    await runTask(tasks, task, args);
  } catch (error) {
    throw new TaskExecutionError(error);
  }
};

export const handleUnknownError = (error, log) => log(error.message || error.toString());
export const handleMissingCommandError = (_, log) => handleUnknownError('You must supply a command', log);
export const handleMissingTaskError = (error, log) => handleUnknownError(`Unknown task: "${error.task}"`, log);
export const handleArgumentValidationError = (errors, log) => handleUnknownError('Validaton errors', log);
export const handleTaskExecutionError = (error, log) => handleUnknownError(error, log);

export const handleCliError = (error, log) => {
  switch (true) {
    case error instanceof MissingCommandError:
      return handleMissingCommandError(error, log);
    case error instanceof MissingTaskError:
      return handleMissingTaskError(error, log);
    case error instanceof ArgumentValidationError:
      return handleArgumentValidationError(error, log);
    case error instanceof TaskExecutionError:
      return handleTaskExecutionError(error, log);
    default:
      return handleUnknownError(error, log);
  }
};

// Create a CLI application based on a set of command sand tasks
export const createCli = ({ commands, tasks } = {}) => async ({
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
