// @flow
import { type CommandDefinition } from './types.flow';

/**
 * Finds a command by name from an array of commands
 * @param commands
 * @param commandName
 */
export default function findCommand(
  commands: Array<CommandDefinition<*>>,
  commandName: $PropertyType<CommandDefinition<*>, 'name'>,
) {
  return commands.find(({ name }) => name === commandName);
}
