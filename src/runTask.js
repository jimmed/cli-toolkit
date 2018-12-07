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

export default async function runTask(
  tasks: Array<TaskDefinition>,
  task: TaskDefinition,
  args: *,
): $Call<$PropertyType<TaskDefinition, 'run'>> {
  const childTasks: Array<ChildTaskDefinition> = [];
  let progress: ProgressState;

  // Declare methods we will pass to our task runner method
  const actions = {
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
    getState(): ProgressState {
      return progress || { total: 0, done: 0 };
    },
    setState(change: $Shape<ProgressState>) {
      progress = { ...this.getState(), ...change };
    },
    setTotal(total: number) {
      this.setState({ total });
    },
    incTotal(delta: number = 1) {
      const { total } = this.getState();
      this.setTotal(total + delta);
    },
    setComplete(complete: number) {
      this.setState({ complete });
    },
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
