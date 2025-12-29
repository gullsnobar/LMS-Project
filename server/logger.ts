import pino from "pino";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",        // This enables colorful logs
    options: {
      colorize: true,             // Colors for log levels
      translateTime: "yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname"      // Remove clutter
    }
  }
});

export default logger;
