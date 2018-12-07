// @flow
import { type CommandDefinition } from './types.flow';

export default async function commandSelectionPrompt(
  commands: Array<CommandDefinition<*>>,
): Promise<CommandDefinition<*>> {
  throw new Error('TODO: commandSelectionPrompt is not implemented');
}
