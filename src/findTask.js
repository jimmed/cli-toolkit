// @flow
import { type TaskDefinition } from './types.flow';
import { MissingTaskError } from './errors';

const findTask = (
  tasks: Array<TaskDefinition>,
  taskName: $PropertyType<TaskDefinition, 'name'>,
) => {
  const matchedTask = tasks.find(({ name }) => name === taskName);
  if (!matchedTask) {
    throw new MissingTaskError(taskName);
  }
  return matchedTask;
};

export default findTask;
