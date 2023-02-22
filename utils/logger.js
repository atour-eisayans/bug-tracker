const path = require('path');
const winston = require('winston');
require('winston-daily-rotate-file');

const { isProduction } = require('./getEnvironment');

const generateProductionTransports = () => {
    const dailyErrorsTransportConfig = new winston.transports.DailyRotateFile({
        level: 'error',
        filename: path.join(__dirname, '..', 'logs', 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
    });

    const dailyWarnsTransportConfig = new winston.transports.DailyRotateFile({
        level: 'warning',
        filename: path.join(__dirname, '..', 'logs', 'warning-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '30m',
    });

    const dailyInfosTransportConfig = new winston.transports.DailyRotateFile({
        level: 'info',
        filename: path.join(__dirname, '..', 'logs', 'info-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '100m',
        maxFiles: '7d', // logs related to past 7 days will be kept
    });

    const dailyRoutesTransportConfig = new winston.transports.DailyRotateFile({
        level: 'debug',
        filename: path.join(__dirname, '..', 'logs', 'routes-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '10m',
    });

    return [
        dailyErrorsTransportConfig,
        dailyWarnsTransportConfig,
        dailyInfosTransportConfig,
        dailyRoutesTransportConfig,
    ];
};

const transports = isProduction
    ? generateProductionTransports()
    : [
          new winston.transports.Console({
              level: 'debug',
          }),
        //   new winston.transports.Console(),
      ];

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: new Date().toISOString() }),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    transports,
});

module.exports = logger;
