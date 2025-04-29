function onErrorHook(request, reply, error, done) {
  request.log.error({ err: error }, 'Unhandled error');
  done();
}

module.exports = { onErrorHook };
