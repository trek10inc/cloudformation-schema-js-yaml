'use strict';

const yaml = require('js-yaml');

module.exports = yaml.Schema.create([
  require('./lib/and.js'),
  require('./lib/base64.js'),
  require('./lib/equals.js'),
  require('./lib/findInMap.js'),
  require('./lib/getAtt.js'),
  require('./lib/getAZs.js'),
  require('./lib/if.js'),
  require('./lib/importValue.js'),
  require('./lib/join.js'),
  require('./lib/not.js'),
  require('./lib/or.js'),
  require('./lib/ref.js'),
  require('./lib/select.js'),
  require('./lib/split.js'),
  require('./lib/sub.js'),
].reduce((p, c) => {
  // some cloudformation functions are two types, so we flatten the list
  if (Array.isArray(c)) {
    return p.concat(c)
  } else {
    p.push(c)
    return p
  }
}, [])
)
