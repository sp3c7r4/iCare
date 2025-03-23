import chalk from 'chalk';

const Logger = {
  log(info: string): void {
    console.log(chalk.green(`[LOG]: ${info}`));
  },
  error(info: string): void {
    console.log(chalk.red(`[ERROR]: ${info}`));
  },
  server(info: string): void {
    console.log(chalk.yellow(`[SERVER LOG]: ${info}`));
  }
};

export default Logger;