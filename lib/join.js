'use strict';

const yaml = require('js-yaml');

const functionName = 'Fn::Join'
const yamlName = '!Join'

class Obj {
  constructor (params) {
    this[functionName] = params
  }
}

const Type = new yaml.Type(yamlName, {
  kind: 'sequence',
  resolve: function (data) {
    return data.length === 2 &&
           typeof data[0] === 'string' &&
           Array.isArray(data[1])
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
