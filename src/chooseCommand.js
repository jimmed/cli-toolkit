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

/**
 * Takes a command and arguments from a user, parses them,
 * and then (where possible) uses interactive prompts to fill
 * in any missing information before returning both the chosen
 * command, and the arguments.
 * @param commands
 * @param argv
 */
export default async function chooseCommand(
  commands: { [commandName: string]: CommandDefinition<*> },
  argv: typeof process.argv,
  defaultCommand?: ?string,
): Promise<[CommandDefinition<*>, *]> {
  // Figure out which command the user wanted
  const rawArgs = parseArgv(argv);
  const useInteractivePrompts = rawArgs.interactive != null ? rawArgs.interactive : interactiveSupported();
  const inputCommand = argv[2] || defaultCommand;
  let matchedCommand = findCommand(commands, inputCommand);
  while (!matchedCommand) {
    if (!useInteractivePrompts) {
      throw new MissingCommandError(inputCommand || '(no command)');
    } else {
      // eslint-disable-next-line no-await-in-loop
      matchedCommand = await commandSelectionPrompt(commands);
    }
  }

  const inputArgs = parseArgv(argv, matchedCommand);
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
