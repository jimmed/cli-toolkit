// @flow
import { type CommandDefinition } from './types.flow';

export default function parseArgv(
  commands: Array<CommandDefinition<*>>,
  argv: typeof process.argv,
): [string, Object] {
  throw new Error('TODO: parseArgv is not implemented');
}
