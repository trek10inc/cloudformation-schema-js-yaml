'use strict';

const yaml = require('js-yaml');

const functionName = 'Fn::GetAtt'
const yamlName = '!GetAtt'

class Obj {
  constructor (params) {
    let splits = params.split('.')
    let logicalId = splits.shift()
    let attribute = splits.join('.')
    this[functionName] = [logicalId, attribute]
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
    return obj[functionName].join('.')
  }
})

Type.class = Obj
module.exports = Type
