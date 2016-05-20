'use strict';

var expect = require('chai').expect;

var statsdPlugin = require('../index');

var initialise = function(config, done) {
  statsdPlugin.register(config, {}, done);
};

describe('oc-statsd', function() {

  describe('when requesting a statsd client without namespace', function() {

    var result;
    before(function(done) {
      initialise({debug: true, prefix: 'test.client'}, function() {
        result = statsdPlugin.execute();
        done();
      });
    });

    it('should return a statsd client', function() {
      expect(result).to.not.be.null;
    });

    it('should return a statsd client with root namespace', function() {
      expect(result.options.prefix).to.equal('test.client.');
    });

  });

  describe('when requesting a statsd client with namespace', function() {

    var result;
    before(function(done) {
      initialise({debug: true, prefix: 'test.client'}, function() {
        result = statsdPlugin.execute('new.prefix');
        done();
      });
    });

    it('should return a statsd client', function() {
      expect(result).to.not.be.null;
    });

    it('should return a statsd client with root namespace', function() {
      expect(result.options.prefix).to.equal('test.client.new.prefix.');
    });

  });

  describe('when requesting a statsd client to host', function() {

    var result;
    before(function(done) {
      initialise({host: 'statsd.host.local', debug: true, prefix: 'test.client'}, function() {
        result = statsdPlugin.execute('new.prefix');
        done();
      });
    });

    it('should return a statsd client', function() {
      expect(result).to.not.be.null;
    });

    it('should return a statd client with host', function() {
      expect(result._socket._hostname).to.equal('statsd.host.local');
    });

    it('should return a statd client with default port', function() {
      expect(result._socket._port).to.equal(8125);
    });

  });

  describe('when requesting a statsd client with sanitize', function() {

    var result;
    before(function(done) {
      initialise({host: 'statsd.host.local', debug: true, prefix: 'test.client'}, function() {
        result = statsdPlugin.execute('new.prefix');
        done();
      });
    });

    it('should return a statsd client', function() {
      expect(result).to.not.be.null;
    });

    it('should return a statd client with sanitize function', function() {
      expect(result.sanitize).is.a('function');
    });


    it('sanitize should replace space with underscore', function() {
      expect(result.sanitize('  ')).to.equal('_');
    });

    it('sanitize should replace forward slash with dash', function() {
      expect(result.sanitize('/')).to.equal('-');
    });

    it('sanitize should remove everything else ', function() {
      expect(result.sanitize('§$')).to.equal('');
    });
  });

});
