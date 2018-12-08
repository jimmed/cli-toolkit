// @flow
import argvToRawArgs from 'yargs-parser';
import { type CommandDefinition } from './types.flow';

/**
 * Parses an argv array based on the supplied commands, and
 * returns a tuple containing the selected command and the parsed arguments
 * @param commands
 * @param argv
 */
export default function parseArgv(
  argv: typeof process.argv,
  command: ?CommandDefinition<*>,
): { interactive?: boolean } {
  return argvToRawArgs(argv, command && command.args);
}
