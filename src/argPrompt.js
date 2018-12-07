// @flow
import { type CommandDefinition } from './types.flow';

export default async function argPrompt<T, U>(
  command: CommandDefinition<T>,
  args: $Shape<U>,
): Promise<U> {
  throw new Error('TODO: argPrompt is not implemented');
}
