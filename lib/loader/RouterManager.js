const {
  throwIfMissing,
  isPresent,
  isNonEmptyString
} = require('@grinwiz/utils');

class RouterManager {
  constructor(ctx) {
    throwIfMissing(ctx, 'ctx is required');
    throwIfMissing(ctx.app, 'ctx.app is required');
    throwIfMissing(ctx.routes, 'ctx.routes is required');

    this.app = ctx.app;
    this.routes = ctx.routes;
  }

  checkPrefixOptions(options) {
    return isPresent(options) && isNonEmptyString(options.prefix);
  }

  async registerRoutes() {
    this.app.get('/', {
      config: { skipFormat: true }
    }, async () => ({ status: 'ok' }));

    for (const { routes, options } of this.routes) {
      const optionsWithPrefix = this.checkPrefixOptions(options) ? options : { ...options, prefix: '/' };

      await this.app.register(async function (scope) {
        for (const { route, options } of routes) {
          scope.register(route, options);
        }
      }, optionsWithPrefix);
    }
  }
}

module.exports = RouterManager;
