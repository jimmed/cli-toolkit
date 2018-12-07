// @flow
import {
  type CommandDefinition,
  type TaskDefinition,
  type ArgValidationErrors,
} from './types.flow';
// TODO: Add docs URL for each error

// TODO: Alternative command suggestion
export class MissingCommandError extends Error {
  commandName: $PropertyType<CommandDefinition<*>, 'name'>;

  constructor(commandName: $PropertyType<CommandDefinition<*>, 'name'>) {
    super(`The command "${commandName}" is not recognised.`);
    this.commandName = commandName;
  }
}

export class MissingTaskError extends Error {
  taskName: $PropertyType<TaskDefinition, 'name'>;

  constructor(taskName: $PropertyType<TaskDefinition, 'name'>) {
    super(`The task "${taskName} is not recognised.`);
    this.taskName = taskName;
  }
}

export class ArgumentValidationError extends Error {
  errors: ArgValidationErrors;

  command: CommandDefinition<*>;

  constructor(errors: ArgValidationErrors, command: CommandDefinition<*>) {
    const message = [
      `Cannot run the "${command.name} command, because:`,
      Object.keys(errors)
        .map(key => errors[key])
        .map(msgOrError => (msgOrError instanceof Error ? msgOrError.message : msgOrError))
        .map(msg => ` - ${msg.split(/\r?\n/g).join('\n   ')}`)
        .join('\n'),
    ].join('\n\n');
    super(message);
    this.errors = errors;
    this.command = command;
  }
}

export class TaskExecutionError extends Error {
  sourceError: Error;

  task: TaskDefinition;

  constructor(sourceError: Error, task: TaskDefinition) {
    super(`The task "${task.name}" failed, because:\n\n${sourceError.message}`);
    this.sourceError = sourceError;
    this.task = task;
  }
}
