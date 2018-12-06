import { MissingTaskError } from './errors';

const findTask = (tasks, taskName) => {
  const matchedTask = tasks.find(({ name }) => name === taskName);
  if (!matchedTask) {
    throw new MissingTaskError(taskName, tasks);
  }
  return matchedTask;
};

export default findTask;
