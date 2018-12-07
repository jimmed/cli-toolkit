// @flow
import { type TaskDefinition } from './types.flow';
import { MissingTaskError } from './errors';

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
