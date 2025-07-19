import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(), // 🌈 Adds color to log level
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Terminal output
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // File for errors
    new winston.transports.File({ filename: 'logs/combined.log' }) // All logs
  ]
});

export default logger;
