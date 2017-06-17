'use strict';

const yaml = require('js-yaml');

const functionName = 'Fn::FindInMap'
const yamlName = '!FindInMap'

class Obj {
  constructor (params) {
    this[functionName] = params
  }
}

const Type = new yaml.Type(yamlName, {
  kind: 'sequence',
  resolve: function (data) {
    return Array.isArray(data) && data.length === 3
  },

  construct: function (data) {
    return new Obj(data)
  },

  instanceOf: Obj,

  represent: function (obj) {
    return obj[functionName]
  }
})

module.exports = Type
