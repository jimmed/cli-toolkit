// @flow
import { type CliOptions } from './types.flow';

export default function handleCliError(
  error: Error,
  log: $PropertyType<CliOptions, 'log'>,
) {
  log(error.message || error.toString());
}
