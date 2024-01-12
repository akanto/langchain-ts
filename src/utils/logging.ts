import morgan from 'morgan';
import winston, { format } from 'winston';

const logger = winston.createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.splat(),
    format.printf((msg: any) => {
      const stackTrace = msg.error ? `\n${msg.error.stack}` : '';
      return `${msg.timestamp} [${msg.level}] ${msg.message}${stackTrace}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

const morganLogger = winston.createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf((msg: any) => `${msg.timestamp} [${msg.level}] ${msg.message}`),
  ),
  transports: [new winston.transports.Console({ level: 'http' })],
});

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message: string) => morganLogger.http(message.trim()),
    },
  },
);

export { morganMiddleware, logger };