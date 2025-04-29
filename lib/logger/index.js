const pino = require('pino');
const {
  throwIfMissing,
  isEqual
} = require('@grinwiz/utils');

const logger = (config) => {
  throwIfMissing(config, 'config is required');

  return {
    level: config.LOG.LEVEL || 'info',
    base: { name: config.LOG.NAME },
    formatters: {
      level(label, number) {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(isEqual(config.NODE_ENV, 'development') ? {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'yyyy-mm-dd HH:MM:ss Z',
          ignore: 'pid,hostname'
        },
      }
    } : {})
  }
}

module.exports = logger;