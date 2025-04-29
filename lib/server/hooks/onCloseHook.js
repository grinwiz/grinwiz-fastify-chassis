function onCloseHook(instance, done) {
  instance.log.info('Shutting down server...');
  done();
}

module.exports = { onCloseHook };
