// @flow
import { type CommandDefinition } from './types.flow';

/**
 * Interactively prompts a user to select a command from a list.
 * @param commands
 */
export default async function commandSelectionPrompt(commands: {
  [commandName: string]: CommandDefinition<*>,
}): Promise<CommandDefinition<*>> {
  throw new Error('TODO: commandSelectionPrompt is not implemented');
}
