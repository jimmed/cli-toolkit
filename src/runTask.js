// @flow
import { type TaskDefinition } from './types.flow';
import findTask from './findTask';
import undoTask from './undoTask';

type ChildTaskDefinition = {
  task: TaskDefinition,
  args: *,
  promise: Promise<*>,
};

type ProgressState = {
  total: number,
  done: number,
};

/**
 * Runs a task, allowing the task to add child tasks, and emit
 * progress events as it goes.
 *
 * If the task (or one of its children) fails, then the task
 * (and its children) will be undone.
 * @param tasks
 * @param task
 * @param args
 */
export default async function runTask(
  tasks: { [taskName: string]: TaskDefinition },
  task: TaskDefinition,
  args: *,
): $Call<$PropertyType<TaskDefinition, 'run'>> {
  const childTasks: Array<ChildTaskDefinition> = [];
  let progress: ProgressState;

  const actions = {
    /**
     * Adds a child task to execute, and returns a Promise
     * which will resolve/reject based on the task outcome.
     * @param childTaskName
     * @param childArgs
     */
    childTask(
      childTaskName: $PropertyType<TaskDefinition, 'name'>,
      childArgs: *,
    ) {
      const matched = findTask(tasks, childTaskName);
      const childTask = {
        task: matched,
        args: childArgs,
        promise: runTask(tasks, matched, childArgs),
      };
      childTasks.push(childTask);
    },

    /**
     * Gets the current progress of the task
     */
    getState(): ProgressState {
      return progress || { total: 0, done: 0 };
    },

    /**
     * Patches the task's current progress state with new values
     * @param change
     */
    setState(change: $Shape<ProgressState>) {
      progress = { ...this.getState(), ...change };
    },

    /**
     * Sets a new progress total for the task
     * @param total
     */
    setTotal(total: number) {
      this.setState({ total });
    },

    /**
     * Increments the progress total for the task
     * @param delta
     */
    incTotal(delta: number = 1) {
      const { total } = this.getState();
      this.setTotal(total + delta);
    },

    /**
     * Sets the progress completion for the task
     * @param complete
     */
    setComplete(complete: number) {
      this.setState({ complete });
    },

    /**
     * Increments the progress completion for the task
     * @param delta
     */
    incComplete(delta: number = 1) {
      const { complete } = this.getState();
      this.setComplete(complete + delta);
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
}
