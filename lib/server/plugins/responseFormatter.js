const fp = require('fastify-plugin');

async function responseFormatter(fastify, options) {
  fastify.addHook('onSend', async (req, reply, payload = { ...data }) => {
    if (req.routeOptions.config.skipFormat) {
      return payload;
    }

    try {
      const parsedPayload = JSON.parse(payload);

      if (parsedPayload?.statusCode && parsedPayload.statusCode !== 200) {
        return payload;
      }

      const formatted = { data: parsedPayload };

      return JSON.stringify(formatted);
    } catch (err) {
      return payload;
    }
  });
}

module.exports = fp(responseFormatter);
