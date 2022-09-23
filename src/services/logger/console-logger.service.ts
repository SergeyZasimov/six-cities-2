import { LoggerInterface } from './logger.interface.js';

export default class ConsoleLoggerService implements LoggerInterface {
  public debug( message: string, ...args: unknown[] ) {
    console.debug(message, ...args);
  }

  public error( message: string, ...args: unknown[] ) {
    console.error(message, ...args);
  }

  public info( message: string, ...args: unknown[] ) {
    console.info(message, ...args);
  }

  public warn( message: string, ...args: unknown[] ) {
    console.warn(message, ...args);
  }
}
