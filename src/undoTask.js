// @flow
import { type TaskDefinition } from './types.flow';

/**
 * Attempts to gracefully undo a task's operation. If an error occurs
 * during this time, the error will be logged to the console and the
 * returned promise will *still resolve*.
 * @param task
 * @param args
 */
export default async function (task: TaskDefinition, args: *) {
  if (!task.undo) {
    return;
  }
  try {
    await task.undo(task, args);
  } catch (error) {
    // TODO: Find a better way to log this error (using log provided from options)
    console.warn(error); // eslint-disable-line no-console
  }
}
