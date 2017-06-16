'use strict';

const StatsDClient = require('statsd-client');

const WHITESPACE_REGEX    = /\s+/g;
const FORWARD_SLASH_REGEX = /\//g;
const UNCLEAN_REGEX       = /[^a-zA-Z_\-0-9\.]/g;


StatsDClient.prototype.sanitize = (key) => key
  .replace(WHITESPACE_REGEX, '_')
  .replace(FORWARD_SLASH_REGEX, '-')
  .replace(UNCLEAN_REGEX, '');

let statsDClient;

const getClient = (namespace) => {
  const prefix = namespace || '';
  return statsDClient.getChildClient(statsDClient.sanitize(prefix));
};

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
module.exports.register = (options, dependencies, next) => {
  statsDClient = new StatsDClient(options);
  next(null, { client: getClient });
};

/**
 * Get instance of statsd client in the supplied namespace
 * @param {string} [namespace=] - the namespace of the returned client
 */
module.exports.execute = getClient;
