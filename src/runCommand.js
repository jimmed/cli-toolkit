// @flow
import { type CommandDefinition, type TaskDefinition } from './types.flow';
import { TaskExecutionError } from './errors';
import findTask from './findTask';
import runTask from './runTask';

export default async function runCommand(
  { task: taskName }: CommandDefinition<*>,
  tasks: Array<TaskDefinition>,
  args: *,
) {
  const task = findTask(tasks, taskName);
  try {
    await runTask(tasks, task, args);
  } catch (error) {
    throw new TaskExecutionError(error, task);
  }
}
