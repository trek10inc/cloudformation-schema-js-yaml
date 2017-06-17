'use strict';

const yaml = require('js-yaml');

const functionName = 'Fn::Sub'
const yamlName = '!Sub'

class Obj {
  constructor (params) {
    this[functionName] = params
  }
}

const Type = new yaml.Type(yamlName, {
  kind: 'scalar',
  resolve: function (data) {
    return typeof data === 'string'
  },

  construct: function (data) {
    return new Obj(data)
  },

  instanceOf: Obj,

  represent: function (obj) {
    return obj[functionName]
  }
})

const Type2 = new yaml.Type(yamlName, {
  kind: 'sequence',
  resolve: function (data) {
    return data.length === 2 &&
           typeof data[0] === 'string' &&
           typeof data[1] === 'object'
  },

  construct: function (data) {
    return new Obj(data)
  },

  instanceOf: Obj,

  represent: function (obj) {
    return obj[functionName]
  }
})

module.exports = [ Type, Type2 ]
