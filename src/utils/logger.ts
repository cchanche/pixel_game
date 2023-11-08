/**
 * Prints console messages with prefix
 */
export class Logger {
  private readonly scope: string;
  constructor(scope?: string) {
    this.scope = scope || 'nodemon';
  }
  log = (...data: unknown[]) =>
    // eslint-disable-next-line no-console
    console.log(
      `\x1b[2m${new Date().toLocaleTimeString()}\x1b[0m`,
      `\x1b[1m\x1b[36m[${this.scope}]\x1b[0m `,
      ...data,
    );
  error = (...data: unknown[]) =>
    console.error(
      `\x1b[2m${new Date().toLocaleTimeString()}\x1b[0m`,
      `\x1b[1m\x1b[36m[${this.scope}]\x1b[0m \x1b[31m`,
      ...data,
      '\x1b[0m',
    );
  warn = (...data: unknown[]) =>
    // eslint-disable-next-line no-console
    console.warn(
      `\x1b[2m${new Date().toLocaleTimeString()}\x1b[0m`,
      `\x1b[1m\x1b[36m[${this.scope}]\x1b[0m \x1b[33m`,
      ...data,
      '\x1b[0m',
    );
}
