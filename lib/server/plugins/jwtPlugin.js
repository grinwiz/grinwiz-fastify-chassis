const fp = require('fastify-plugin');
const fastifyJwt = require('@fastify/jwt');

async function jwtPlugin(fastify, opts) {
  const { SECRET, EXPIRES_IN } = opts.JWT;
  fastify.register(fastifyJwt, {
    secret: SECRET,
    sign: { expiresIn: EXPIRES_IN }
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
