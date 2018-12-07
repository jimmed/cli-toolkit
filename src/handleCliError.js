// @flow
import { type CliOptions } from './types.flow';

const handleCliError = (error: Error, log: $PropertyType<CliOptions, 'log'>) => log(error.message || error.toString());

export default handleCliError;
