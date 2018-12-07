// @flow
export type TaskRunner = (args: *, actions: *) => Promise<*> | *;

export type TaskActions<T, U> = {
  childTask: (taskName: string, args: T) => $Call<TaskRunner<T, U>>,
};

export type TaskDefinition = {
  name: string,
  run: TaskRunner,
  undo: TaskRunner,
};

export type ArgumentType = 'boolean' | 'string' | 'integer' | 'float';

export type ArgumentDefinition = {
  name: string,
  type: ArgumentType,
  default?: boolean,
  required?: boolean,
  position?: number,
  alias?: string | Array<string>,
  conflicts?: string | Array<string>,
};

export type ArgsValidator<T = *> = (args: T) => void;

export type CommandDefinition<T = *> = {
  name: string,
  args: Array<ArgumentDefinition>,
  validate?: ArgsValidator<T>,
  task: string,
};

export type CliDefinition = {
  name?: string,
  defaultCommand: $PropertyType<CommandDefinition<*>, 'name'>,
  commands: Array<CommandDefinition<*>>,
  tasks: Array<TaskDefinition>,
};

export type ArgValidationErrors = {
  [argName: $PropertyType<ArgumentDefinition, 'name'>]: string | Error,
};

export type CliOptions = {
  argv: typeof process.argv,
  log: typeof console.log,
};
