const Fastify = require('fastify');
const { throwIfMissing } = require('@grinwiz/utils');
const { PluginManager, RouterManager } = require('../loader');
const { validateEnv, resolveEnv } = require('../validations');
const gracefulShutdown = require('./plugins/gracefulShutdown');
const { onErrorHook } = require('./hooks/onErrorHook');
const { onCloseHook } = require('./hooks/onCloseHook');
const customLogger = require('../logger');

class Server {
  constructor(opts) {
    throwIfMissing(opts, 'opts is required');
    throwIfMissing(opts.config, 'config is required');

    const { config, routes = [], plugins = [] } = opts;

    validateEnv(config);

    this.config = resolveEnv(config);
    this.routes = routes;
    this.plugins = plugins;

    this.app = Fastify({
      ignoreTrailingSlash: true,
      logger: customLogger(this.config)
    });

    this.logger = this.app.log;
    this.pluginManager = new PluginManager(this);
    this.routeManager = new RouterManager(this);
  }

  _registerHooks() {
    this.app.addHook('onError', onErrorHook);
    this.app.addHook('onClose', onCloseHook);
  }

  async _init() {
    this._registerHooks();
    this.pluginManager.registerCorePlugins();
    this.pluginManager.registerCustomPlugins(this.plugins);
    await this.routeManager.registerRoutes();
    await gracefulShutdown(this);
  }

  async start() {
    console.time("Starting server");
    try {
      await this._init();
      const { port = 3000, host = '0.0.0.0' } = this.config.server;
      await this.app.listen({ port, host });
    } catch (err) {
      this.logger.error(err);
      process.exit(1);
    }
    console.timeEnd("Starting server");
  }
}

module.exports = { Server };