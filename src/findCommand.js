// @flow
import { type CommandDefinition } from './types.flow';

export default function findCommand(
  commands: Array<CommandDefinition<*>>,
  commandName: $PropertyType<CommandDefinition<*>, 'name'>,
) {
  return commands.find(({ name }) => name === commandName);
}
