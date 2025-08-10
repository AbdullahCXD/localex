import Chalk from "chalk";

export enum LogLevel {
  INFO = "Info",
  WARN = "Warn",
  ERROR = "Error",
  DEBUG = "Debug",
}

export type ChalkColorFunction = (...text: unknown[]) => string;
export type LoggingFormatterFunction = (
  logLevel: LogLevel,
  message: string,
  color: ChalkColorFunction,
) => string;

export interface LoggingOptions {
  debug?: boolean;
  disableLogging?: boolean;
}

export class Logging {
  private formatter: LoggingFormatterFunction;
  private options: LoggingOptions;

  constructor(formatter?: LoggingFormatterFunction, options?: LoggingOptions) {
    this.formatter =
      formatter ?? ((level, message, color) => `${color(level)} | ${message}`);
    this.options = options ?? {};
  }

  private formatMessage(message: string, ...format: string[]): string {
    let formattedMessage = message;
    let formatIndex = 0;

    formattedMessage = formattedMessage.replace(/%s/g, () => {
      if (formatIndex < format.length) {
        return format[formatIndex++]!;
      }
      return "%s";
    });

    return formattedMessage;
  }

  info(message: string, ...format: string[]) {
    if (this.options.disableLogging) return;
    const formattedMessage = this.formatMessage(message, ...format);
    const coloredOutput = this.formatter(
      LogLevel.INFO,
      formattedMessage,
      Chalk.blue,
    );
    console.log(coloredOutput);
  }

  warn(message: string, ...format: string[]) {
    if (this.options.disableLogging) return;
    const formattedMessage = this.formatMessage(message, ...format);
    const coloredOutput = this.formatter(
      LogLevel.WARN,
      formattedMessage,
      Chalk.yellow,
    );
    console.log(coloredOutput);
  }

  error(message: string, ...format: string[]) {
    if (this.options.disableLogging) return;
    const formattedMessage = this.formatMessage(message, ...format);
    const coloredOutput = this.formatter(
      LogLevel.ERROR,
      formattedMessage,
      Chalk.red,
    );
    console.log(coloredOutput);
  }

  debug(message: string, ...format: string[]) {
    if (this.options.disableLogging) return;
    if (!this.options.debug) return;
    const formattedMessage = this.formatMessage(message, ...format);
    const coloredOutput = this.formatter(
      LogLevel.DEBUG,
      formattedMessage,
      Chalk.gray,
    );
    console.log(coloredOutput);
  }
}
