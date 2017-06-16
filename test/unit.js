'use strict';

var expect = require('chai').expect;
var statsdPlugin = require('../index');

var initialise = (config, done) => {
  statsdPlugin.register(config, {}, done);
};

describe('oc-statsd', () => {

  describe('when initialised', () => {

    let result;
    before((done) => {
      initialise({
        debug: true,
        prefix: 'test.client'
      }, (err, details) => {
        result = details.client;
        done();
      });
    });

    it('should return the initialised client', () => {
      expect(result('my.stat').timing).to.be.a('function');
    });
  });

  describe('when requesting a statsd client without namespace', () => {

    var result;
    before((done) => {
      initialise({debug: true, prefix: 'test.client'}, () => {
        result = statsdPlugin.execute();
        done();
      });
    });

    it('should return a statsd client', () => {
      expect(result).to.not.be.null;
    });

    it('should return a statsd client with root namespace', () => {
      expect(result.options.prefix).to.equal('test.client.');
    });
  });

  describe('when requesting a statsd client with namespace', () => {

    var result;
    before((done) => {
      initialise({debug: true, prefix: 'test.client'}, () => {
        result = statsdPlugin.execute('new.prefix');
        done();
      });
    });

    it('should return a statsd client', () => {
      expect(result).to.not.be.null;
    });

    it('should return a statsd client with root namespace', () => {
      expect(result.options.prefix).to.equal('test.client.new.prefix.');
    });
  });

  describe('when requesting a statsd client to host', () => {

    var result;
    before((done) => {
      initialise({host: 'statsd.host.local', debug: true, prefix: 'test.client'}, () => {
        result = statsdPlugin.execute('new.prefix');
        done();
      });
    });

    it('should return a statsd client', () => {
      expect(result).to.not.be.null;
    });

    it('should return a statd client with host', () => {
      expect(result._socket._hostname).to.equal('statsd.host.local');
    });

    it('should return a statd client with default port', () => {
      expect(result._socket._port).to.equal(8125);
    });
  });

  describe('when requesting a statsd client with sanitize', () => {

    var result;
    before((done) => {
      initialise({host: 'statsd.host.local', debug: true, prefix: 'test.client'}, () => {
        result = statsdPlugin.execute('new.prefix');
        done();
      });
    });

    it('should return a statsd client', () => {
      expect(result).to.not.be.null;
    });

    it('should return a statd client with sanitize function', () => {
      expect(result.sanitize).is.a('function');
    });


    it('sanitize should replace space with underscore', () => {
      expect(result.sanitize('  ')).to.equal('_');
    });

    it('sanitize should replace forward slash with dash', () => {
      expect(result.sanitize('/')).to.equal('-');
    });

    it('sanitize should remove everything else ', () => {
      expect(result.sanitize('§$')).to.equal('');
    });
  });
});
