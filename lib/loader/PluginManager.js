const { throwIfMissing, throwIfNotArray } = require('@grinwiz/utils');

class PluginManager {
  constructor(ctx) {
    throwIfMissing(ctx, 'ctx is required');
    throwIfMissing(ctx.app, 'ctx.app is required');
    throwIfMissing(ctx.config, 'ctx.config is required');
    throwIfMissing(ctx.plugins, 'ctx.plugins is required');
    throwIfNotArray(ctx.plugins, 'ctx.plugins must be an array');

    this.app = ctx.app;
    this.config = ctx.config;
    this.plugins = ctx.plugins;
  }

  getCorePlugins() {
    return [
      { plugin: require('@fastify/cors') },
      { plugin: require('@fastify/helmet') },
      { plugin: require('fastify-healthcheck') },
      { plugin: require('../server/plugins/jwtPlugin'), options: this.config }
    ]
  }

  registerCorePlugins() {
    const corePlugins = this.getCorePlugins();
    for (const { plugin, options = {} } of corePlugins) {
      this.app.register(plugin, options);
    }
  }

  registerCustomPlugins(plugins = []) {
    for (const { plugin, options = {} } of plugins) {
      this.app.register(plugin, options);
    }
  }
}

module.exports = PluginManager;
