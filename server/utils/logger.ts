import chalk from "chalk";

export const log = {
  info: (msg: string) => console.log(chalk.blue("ℹ️ INFO:"), chalk.white(msg)),
  success: (msg: string) => console.log(chalk.green("✅ SUCCESS:"), chalk.white(msg)),
  warn: (msg: string) => console.log(chalk.yellow("⚠️ WARN:"), chalk.white(msg)),
  error: (msg: string) => console.log(chalk.red("❌ ERROR:"), chalk.white(msg)),
  server: (msg: string) => console.log(chalk.cyan("🚀 SERVER:"), chalk.bold(msg)),
  db: (msg: string) => console.log(chalk.magenta("🗄️ DATABASE:"), chalk.white(msg)),
};
