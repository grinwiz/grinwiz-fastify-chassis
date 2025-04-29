const fp = require('fastify-plugin');
const fastifyGracefulShutdown = require('fastify-graceful-shutdown');
const { throwIfMissing } = require('@grinwiz/utils');

async function gracefulShutdown(ctx) {
  throwIfMissing(ctx, 'ctx is required');
  throwIfMissing(ctx.logger, 'ctx.logger is required');

  this.app = ctx.app;
  this.logger = ctx.logger;

  this.app.register(fastifyGracefulShutdown, {
    shutdownTimeout: 5000,
    signals: ['SIGINT', 'SIGTERM'],
    onShutdown: async () => {
      this.logger.info('Cleaning up resources before shutdown...');
      // You can add custom cleanup logic here, like closing DB connections, etc.
    },
  });
}

module.exports = fp(gracefulShutdown);
