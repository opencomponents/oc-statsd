oc-statsd [![Build Status](https://secure.travis-ci.org/opentable/oc-statsd.png?branch=master)](http://travis-ci.org/opentable/oc-statsd)
==========

[OpenComponents](https://github.com/opentable/oc) plugin for interacting with [StatsD](https://github.com/etsy/statsd) inside OC components.

# Requirements:

* Node version: min: **0.10.40**, recommended: **>=4.2.X**
* OC registry
* StatsD server

### Install

```js
npm i oc-statsd --save
```

### Registry setup

More info about integrating OC plugins: [here](https://github.com/opentable/oc/blob/master/docs/registry.md#plugins)

```js
...
var registry = new oc.registry(configuration);

registry.register({
  name: 'statsd',
  register: require('oc-statsd'),
  options: {
    host: 'statsd.hosts.com',
    prefix: 'oc-registry.prod.vm12345',
    port: 8125,
    debug: false
  }
}, function(err){
  if(err){
    console.log('plugin initialisation failed:', err);
  } else {
    console.log('statsd now available');
  }
});

...

registry.start(callback);
```

### Using it inside components

Example for a components' server.js:

```js

module.exports.data = function(context, callback){

  var before = new Date();
  var stats = context.plugins.statsd('mycomponent.doSomething');

  doSomething(function(){
    ...
    stats.timing('something.happened', new Date() - before);
    callback(null, { ... });
  });
};
```

### API

####Api for plugin setup:

|parameter|type|mandatory|description|
|---------|----|---------|-----------|
|debug|`boolean`|no|Debug mode|
|host|`string`|yes|The statsd host|
|port|`number`|no|Default 8152, the statsd port|
|prefix|`string`|yes|The statsd prefix|

#### Api for plugin usage:

The plugin name is declared when initialising a plugin. Following assumes `statsd` is the designated name.

##### context.plugins.statsd(namespace)

Gets instance of statsd client in the supplied namespace.

# Contributing

Yes please. Open an issue first.

### License

MIT
