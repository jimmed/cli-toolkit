// @flow
import { type CliOptions } from './types.flow';

/**
 * Log an error to the console, and hope that it has a half-decent
 * message.
 * @param {*} error
 * @param {*} log
 */
export default function handleCliError(
  error: Error,
  log: $PropertyType<CliOptions, 'log'>,
) {
  log(error.message || error.toString());
}
