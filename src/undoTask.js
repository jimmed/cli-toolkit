// @flow
import { type TaskDefinition } from './types.flow';

const undoTask = async (task: TaskDefinition, args: *) => {
  if (!task.undo) {
    return;
  }
  try {
    await task.undo(task, args);
  } catch (error) {
    // TODO: Find a better way to log this error (using log provided from options)
    console.warn(error); // eslint-disable-line no-console
  }
};

export default undoTask;
