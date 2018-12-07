// @flow
import { type CommandDefinition } from './types.flow';
import { MissingCommandError, ArgumentValidationError } from './errors';
import parseArgv from './parseArgv';
import findCommand from './findCommand';
import commandSelectionPrompt from './commandSelectionPrompt';
import validateArgs from './validateArgs';
import argPrompt from './argPrompt';
import interactiveSupported from './interactiveSupported';

// TODO: It feels like this function has too many responsibilities; much of the glue
// should be moved to `createCli`, perhaps.

export default async function chooseCommand(
  commands: Array<CommandDefinition<*>>,
  argv: typeof process.argv,
): Promise<[CommandDefinition<*>, *]> {
  const [inputCommand, inputArgs] = parseArgv(commands, argv);
  const useInteractivePrompts = inputArgs.interactive != null
    ? inputArgs.interactive
    : interactiveSupported();

  let matchedCommand = findCommand(commands, inputCommand);
  while (!matchedCommand) {
    if (!useInteractivePrompts) {
      throw new MissingCommandError(inputCommand);
    } else {
      // eslint-disable-next-line no-await-in-loop
      matchedCommand = await commandSelectionPrompt(commands);
    }
  }

  let parsedArgs = inputArgs;
  let errors = await validateArgs(matchedCommand, parsedArgs);
  if (!useInteractivePrompts && errors) {
    throw new ArgumentValidationError(errors, matchedCommand);
  }

  while (errors) {
    // eslint-disable-next-line no-await-in-loop
    parsedArgs = await argPrompt(matchedCommand, parsedArgs);
    // eslint-disable-next-line no-await-in-loop
    errors = await validateArgs(matchedCommand, parsedArgs);
  }

  return [matchedCommand, parsedArgs];
}
