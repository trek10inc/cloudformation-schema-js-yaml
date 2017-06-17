'use strict';

const yaml = require('js-yaml');

const functionName = 'Fn::GetAtt'
const yamlName = '!GetAtt'

class Obj {
  constructor (params) {
    this[functionName] = params
  }
}

const Type = new yaml.Type(yamlName, {
  kind: 'sequence',
  resolve: function (data) {
    return Array.isArray(data) && data.length === 2
  },

  construct: function (data) {
    return new Obj(data)
  },

  instanceOf: Obj,

  represent: function (obj) {
    return obj[functionName]
  }
})

Type.class = Obj
module.exports = Type
