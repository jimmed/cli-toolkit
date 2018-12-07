// @flow
import { type CommandDefinition } from './types.flow';

const findCommand = (
  commands: Array<CommandDefinition<*>>,
  commandName: $PropertyType<CommandDefinition<*>, 'name'>,
) => commands.find(({ name }) => name === commandName);

export default findCommand;
