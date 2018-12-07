// @flow
import { type TaskDefinition } from './types.flow';
import findTask from './findTask';
import undoTask from './undoTask';

const runTask = async (
  tasks: Array<TaskDefinition>,
  task: TaskDefinition,
  args: *,
): $Call<$PropertyType<TaskDefinition, 'run'>> => {
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

export default runTask;
