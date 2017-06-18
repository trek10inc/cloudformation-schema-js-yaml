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
  kind: 'scalar',
  resolve: function (data) {
    return typeof data === 'string'
  },

  construct: function (data) {
    let splits = data.split('.')
    let logicalId = splits.shift()
    let attribute = splits.join('.')
    return new Obj([logicalId, attribute])
  },

  instanceOf: Obj,

  represent: function (obj) {
    return obj[functionName].join('.')
  }
})

const Type2 = new yaml.Type(yamlName, {
  kind: 'sequence',
  resolve: function (data) {
    return data.length === 2
  },

  construct: function (data) {
    return new Obj(data)
  },

  instanceOf: Obj,

  represent: function (obj) {
    return obj[functionName].join('.')
  }
})

Type.class = Obj
module.exports = [ Type, Type2 ]
