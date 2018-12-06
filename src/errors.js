// TODO: Add docs URL for each error

// TODO: Alternative command suggestion
export class MissingCommandError extends Error {
  constructor(commandName) {
    super(`The command "${commandName}" is not recognised.`);
    this.commandName = commandName;
  }
}

export class MissingTaskError extends Error {
  constructor(taskName) {
    super(`The task "${taskName} is not recognised.`);
    this.taskName = taskName;
  }
}

export class ArgumentValidationError extends Error {
  constructor(errors, command) {
    const message = [
      `Cannot run the "${command.name} command, because:`,
      Object.values(errors)
        .map(msg => ` - ${msg.split(/\r?\n/g).join('\n   ')}`)
        .join('\n'),
    ].join('\n\n');
    super(message);
    this.errors = errors;
    this.command = command;
  }
}

export class TaskExecutionError extends Error {
  constructor(error, task) {
    super(`The task "${task.name}" failed, because:\n\n${error.message}`);
    this.sourceError = error;
    this.task = task;
  }
}
