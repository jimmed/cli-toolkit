// @flow
import { type CommandDefinition } from './types.flow';

/**
 * Interactively prompts the user to provide values for any
 * missing required values with no defaults, or those that
 * fail validation somehow.
 * @param command
 * @param args
 */
export default async function argPrompt<T, U>(
  command: CommandDefinition<T>,
  args: $Shape<U>,
): Promise<U> {
  throw new Error('TODO: argPrompt is not implemented');
}
