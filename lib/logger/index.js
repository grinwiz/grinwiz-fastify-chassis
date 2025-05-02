const pino = require('pino');
const {
  throwIfMissing,
  isEqual
} = require('@grinwiz/utils');

const logger = (config) => {
  throwIfMissing(config, 'config is required');

  return {
    level: config.logger.level || 'info',
    base: { name: config.logger.name },
    formatters: {
      level(label, number) {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    ...(isEqual(config.server.nodeEnv, 'development') ? {
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