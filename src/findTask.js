// @flow
import { type TaskDefinition } from './types.flow';
import { MissingTaskError } from './errors';

// TODO: I find the lack of consistency between this and `findCommand`
// unsettling; mostly because this throws an error when no match is found,
// but `findCommand` does not.

/**
 * Finds a task by name from an array of tasks. If the task is not
 * found, then a `MissingTaskError` is thrown.
 * @param tasks
 * @param taskName
 */
export default function findTask(
  tasks: Array<TaskDefinition>,
  taskName: $PropertyType<TaskDefinition, 'name'>,
) {
  const matchedTask = tasks.find(({ name }) => name === taskName);
  if (!matchedTask) {
    throw new MissingTaskError(taskName);
  }
  return matchedTask;
}
