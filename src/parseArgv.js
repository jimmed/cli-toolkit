// @flow
import { type CommandDefinition } from './types.flow';

/**
 * Parses an argv array based on the supplied commands, and
 * returns a tuple containing the selected command and the parsed arguments
 * @param commands
 * @param argv
 */
export default function parseArgv(
  commands: Array<CommandDefinition<*>>,
  argv: typeof process.argv,
): [CommandDefinition<*>, Object] {
  throw new Error('TODO: parseArgv is not implemented');
}
