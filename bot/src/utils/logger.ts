import {
  createLogger,
  format,
  LeveledLogMethod,
  Logger,
  transports,
} from "winston";

const customLevels = {
  levels: {
    report: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
};

type CustomLogger = Logger &
  Record<keyof (typeof customLevels)["levels"], LeveledLogMethod>;

const logger: CustomLogger = createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.printf(
      (info) =>
        `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`,
    ),
  ),
  transports: [new transports.Console()],
}) as CustomLogger;

(
  Object.keys(customLevels.levels) as (keyof (typeof customLevels)["levels"])[]
).forEach((level) => {
  logger[level] = logger.log.bind(logger, level);
});

export default logger;
