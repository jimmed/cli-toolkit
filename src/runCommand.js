import { TaskExecutionError } from './errors';
import findTask from './findTask';
import runTask from './runTask';

const runCommand = async ({ task: taskName }, tasks, args) => {
  const task = findTask(tasks, taskName);
  try {
    await runTask(tasks, task, args);
  } catch (error) {
    throw new TaskExecutionError(error);
  }
};

export default runCommand;
