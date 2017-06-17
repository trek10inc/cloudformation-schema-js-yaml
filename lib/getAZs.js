'use strict';

const yaml = require('js-yaml');

const functionName = 'Fn::GetAZs'
const yamlName = '!GetAZs'

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
  kind: 'mapping',
  resolve: function (data) {
    return true
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
