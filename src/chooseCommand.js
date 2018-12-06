import { MissingCommandError, ArgumentValidationError } from './errors';
import parseArgv from './parseArgv';
import findCommand from './findCommand';
import commandSelectionPrompt from './commandSelectionPrompt';
import validateArgs from './validateArgs';
import argPrompt from './argPrompt';
import interactiveSupported from './interactiveSupported';

const chooseCommand = async (commands, argv) => {
  const [inputCommand, inputArgs] = parseArgv(commands, argv);
  const useInteractivePrompts = inputArgs.interactive != null
    ? inputArgs.interactive
    : interactiveSupported();

  let matchedCommand = findCommand(commands, inputCommand);
  while (!matchedCommand) {
    if (!useInteractivePrompts) {
      throw new MissingCommandError(inputCommand);
    } else {
      matchedCommand = findCommand(
        commands,
        // eslint-disable-next-line no-await-in-loop
        await commandSelectionPrompt(commands),
      );
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
};

export default chooseCommand;
