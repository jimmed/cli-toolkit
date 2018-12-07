// @flow
import { type CommandDefinition } from './types.flow';

/**
 * Validates a given set of arguments against a given command's
 * definition. If a custom `validate` method exists on the command,
 * it should be used. If a `type` is specified for a given argument,
 * then that too will be used to validate the argument.
 *
 * If no errors are thrown during validation, then false is returned.
 * Otherwise, an object is returned, whose keys match the erroneous argument names,
 * and whose values are the respective validation Errors thrown.
 * @param {*} command
 * @param {*} args
 */
export default async function validateArgs(
  command: CommandDefinition<*>,
  args: *,
) {
  throw new Error('TODO: validateArgs is not implemented');
}
