import {
  MissingCommandError,
  MissingTaskError,
  ArgumentValidationError,
  TaskExecutionError,
} from './errors';

export const handleUnknownError = (error, log) => log(error.message || error.toString());
export const handleMissingCommandError = (_, log) => handleUnknownError('You must supply a command', log);
export const handleMissingTaskError = (error, log) => handleUnknownError(`Unknown task: "${error.task}"`, log);
export const handleArgumentValidationError = (errors, log) => handleUnknownError('Validaton errors', log);
export const handleTaskExecutionError = (error, log) => handleUnknownError(error, log);

const handleCliError = (error, log) => {
  switch (true) {
    case error instanceof MissingCommandError:
      return handleMissingCommandError(error, log);
    case error instanceof MissingTaskError:
      return handleMissingTaskError(error, log);
    case error instanceof ArgumentValidationError:
      return handleArgumentValidationError(error, log);
    case error instanceof TaskExecutionError:
      return handleTaskExecutionError(error, log);
    default:
      return handleUnknownError(error, log);
  }
};

export default handleCliError;
