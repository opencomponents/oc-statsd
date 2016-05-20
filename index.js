'use strict';

var StatsDClient = require('statsd-client');

var WHITESPACE_REGEX    = /\s+/g,
    FORWARD_SLASH_REGEX = /\//g,
    UNCLEAN_REGEX       = /[^a-zA-Z_\-0-9\.]/g;


StatsDClient.prototype.sanitize = function(key) {
  return key.replace(WHITESPACE_REGEX, '_')
    .replace(FORWARD_SLASH_REGEX, '-')
    .replace(UNCLEAN_REGEX, '');
};

var statsDClient;
/**
 * Register statsD client
 * @param {Object}  options - statsd client options
 * @param {Object}  dependencies unused
 * @param {string}  options.host - statsd server host options
 * @param {int}     [options.port=8152] - statsd server port (default 8152)
 * @param {string}  [options.prefix] - statsd prefix
 * @param {boolean} [options.debug] - debug mode
 * @param {function} next - The callback that handles next.
 */
module.exports.register = function(options, dependencies, next) {
  statsDClient = new StatsDClient(options);
  next();
};

/**
 * Get instance of statsd client in the supplied namespace
 * @param {string} [namespace=] - the namespace of the returned client
 */
module.exports.execute = function(namespace) {
  var prefix = namespace || '';
  return statsDClient.getChildClient(statsDClient.sanitize(prefix));
};
