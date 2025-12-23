import winston from 'winston';

const { combine, timestamp, json, colorize, printf } = winston.format;

const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] ${level}: ${message}${metaStr}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: combine(colorize(), timestamp(), consoleFormat),
    }),
    new winston.transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      level: 'info',
    }),
  ],
});

export { logger };
