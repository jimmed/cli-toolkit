// @flow
/**
 * Returns true if the current shell is a TTY and can take interactive input from the user.
 * This will be used to determine whether to prompt the user for any missing arguments, or
 * fail with an error instead.
 *
 * **N.B.**: I would just return `process.stdout.isTTY` directly, but flow doesn't like that,
 * because `process.stdout` is typed as _either_ a `tty$WritableStream` or a `stream$Writable`;
 * the latter of which has no `isTTY` property, hence the typeof refinement.
 *
 * @see https://github.com/facebook/flow/issues/1825#issuecomment-265904228
 */

export default function interactiveSupported(): boolean {
  if (typeof process.stdout.isTTY !== 'undefined') {
    return !!process.stdout.isTTY;
  }
  return false;
}
