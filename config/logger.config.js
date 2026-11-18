import chalk from "chalk";
import pino from "pino";

global.logger = (text, error) => {
  if (error === null) {
    console.log(chalk.cyan(`[INFO] ${text}`));
  } else if (error === false) {
    console.log(chalk.yellow(`[WARN] ${text}`));
  } else if (error === true) {
    console.log(chalk.red(`[ERROR] ${text}`));
  }
};
const log = (text, error) => console.log(text);
const info = (text) => chalk.blue(text);
const warn = (text) => chalk.yellow(text);
const err = (text) => chalk.red(text);
const logger = pino({ level: "silent" });

export { log, logger, info, warn, err };
