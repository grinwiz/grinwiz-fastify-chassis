const fp = require('fastify-plugin');
const fastifyJwt = require('@fastify/jwt');

async function jwtPlugin(fastify, opts) {
  const { secret, expiresIn } = opts.jwt;
  fastify.register(fastifyJwt, {
    secret,
    sign: { expiresIn }
  });

  fastify.decorate("authenticate", async function (req, reply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

module.exports = fp(jwtPlugin);
