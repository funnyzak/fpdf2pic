// A simple colorized console logger.

import chalk from 'chalk';

class LoggerManager {
  level: string = 'info';
  levels = ['trace', 'debug', 'info', 'warn', 'error'];

  constructor(level: string) {
    this.level = level;
  }

  setLevel(_level: string): void {
    this.level = _level;
  }

  shouldLog(log_level: string): boolean {
    return this.levels.indexOf(log_level) >= this.levels.indexOf(this.level);
  }

  trace(...message: string[]): void {
    if (this.shouldLog('trace')) {
      console.trace(chalk.bgGray.bold(' TRACE '), ...message);
    }
  }
  debug(...message: string[]): void {
    if (this.shouldLog('debug')) {
      console.debug(chalk.yellowBright.bold(' DEBUG '), ...message);
    }
  }
  info(...message: string[]): void {
    if (this.shouldLog('info')) {
      console.info(chalk.bgMagenta.bold(' INFO '), ...message);
    }
  }

  warn(...message: string[]): void {
    if (this.shouldLog('warn')) {
      console.error(chalk.bgYellow.bold(' WARN '), ...message);
    }
  }

  error(...message: string[]): void {
    if (this.shouldLog('error')) {
      console.error(chalk.bgRed.bold(' ERROR '), ...message);
    }
  }

  log(...message: string[]): void {
    console.log(...message);
  }
}

const logger = new LoggerManager('info');

export { logger };
