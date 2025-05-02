const {
  isPresent,
  throwIfMissing,
  throwIfNotArray,
} = require('@grinwiz/utils');

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
    const corePlugins = [];
    corePlugins.push({ plugin: require('@fastify/cors') });
    corePlugins.push({ plugin: require('@fastify/helmet') });
    corePlugins.push({ plugin: require('fastify-healthcheck') });
    if (isPresent(this.config.jwt)) {
      corePlugins.push({ plugin: require('../server/plugins/jwtPlugin'), options: this.config });
    }

    return corePlugins;
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
