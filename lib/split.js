'use strict';

const yaml = require('js-yaml');

const functionName = 'Fn::Split'
const yamlName = '!Split'

class Obj {
  constructor (params) {
    this[functionName] = params
  }
}

const Type = new yaml.Type(yamlName, {
  kind: 'sequence',
  resolve: function (data) {
    return data.length === 2 &&
           typeof data[0] === 'string'
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
