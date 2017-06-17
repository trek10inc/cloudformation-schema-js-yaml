'use strict';

const schema = require('./index.js');
const yaml = require('js-yaml');
const fs   = require('fs');
const test = require('tape');


test('yaml parser should', function (t) {
  t.deepEquals(
    yaml.safeLoad(`test: !And [ 'a', 'b', { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::And': [ 'a', 'b', { Ref: 'logicalId' }]}},
    'parse !And'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Base64 { Ref: 'logicalId'}`, { schema }),
    { test: { 'Fn::Base64': { Ref: 'logicalId' }}},
    'parse !Base64 object params'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Base64 SomeString`, { schema }),
    { test: { 'Fn::Base64': 'SomeString' } },
    'parse !Base64 string params'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Equals [ 'a', 'b' ]`, { schema }),
    { test: { 'Fn::Equals': [ 'a', 'b' ]}},
    'parse !Equals'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !FindInMap [ 'a', 'b', { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::FindInMap': [ 'a', 'b', { Ref: 'logicalId' }]}},
    'parse !FindInMap'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !GetAtt logicalId.attribute`, { schema }),
    { test: { 'Fn::GetAtt': [ 'logicalId', 'attribute' ]}},
    'parse !GetAtt'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !GetAZs region`, { schema }),
    { test: { 'Fn::GetAZs': 'region' }},
    'parse !GetAZs string param'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !GetAZs { Ref: AWS::Region}`, { schema }),
    { test: { 'Fn::GetAZs': { Ref: 'AWS::Region' }}},
    'parse !GetAZs object param'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !If [ 'a', 'b', { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::If': [ 'a', 'b', { Ref: 'logicalId' }]}},
    'parse !If'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !ImportValue value`, { schema }),
    { test: { 'Fn::ImportValue': 'value' }},
    'parse !ImportValue string param'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !ImportValue { Fn::Sub: String}`, { schema }),
    { test: { 'Fn::ImportValue': { 'Fn::Sub': 'String' }}},
    'parse !ImportValue object param'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Join [ 'a', ['b','c'] ]`, { schema }),
    { test: { 'Fn::Join': [ 'a', ['b', 'c' ] ]}},
    'parse !Join'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Not [ { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::Not': [ { Ref: 'logicalId' }]}},
    'parse !Not'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Or [ 'a', 'b', { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::Or': [ 'a', 'b', { Ref: 'logicalId' }]}},
    'parse !Or'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Ref logicalId`, { schema }),
    { test: { Ref: 'logicalId' }},
    'parse !Ref'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Select [ '1', ['b','c'] ]`, { schema }),
    { test: { 'Fn::Select': [ '1', ['b', 'c' ] ]}},
    'parse !Select with 2nd param array'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Select [ '2', {Ref: 'logicalId' } ]`, { schema }),
    { test: { 'Fn::Select': [ '2', {Ref: 'logicalId' } ]}},
    'parse !Select with 2nd param object'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Split [ '1', ['b','c'] ]`, { schema }),
    { test: { 'Fn::Split': [ '1', ['b', 'c' ] ]}},
    'parse !Split with 2nd param array'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Split [ '2', {Ref: 'logicalId' } ]`, { schema }),
    { test: { 'Fn::Split': [ '2', {Ref: 'logicalId' } ]}},
    'parse !Split with 2nd param object'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Sub [ 'string', {} ]`, { schema }),
    { test: { 'Fn::Sub': [ 'string', {} ]}},
    'parse !Sub array param'
  )

  t.deepEquals(
    yaml.safeLoad(`test: !Sub string`, { schema }),
    { test: { 'Fn::Sub': 'string' }},
    'parse !Sub string param'
  )

  // dumper test
  let data = yaml.safeLoad(`
  test:
    - !And ['a', 'b', 'c']
    - !Base64 { Ref: LogicalId }
    - !Base64 string
    - !Equals [ 'a', 'b' ]
    - !FindInMap [ "a", "b", "c" ]
    - !If ['a', 'b' ,'c' ]
    - !ImportValue String
    - !ImportValue { Fn::Sub: "string"}
    - !GetAtt 'a.b'
    - !GetAZs String
    - !GetAZs { Ref: AWS::Region }
    - !Join [ "", ['a', 'b', 'c']]
    - !Not [ !Equals ["a", "b" ]]
    - !Not [""]
    - !Or ['a', 'b']
    - !Ref LogicalId
    - !Select [ "1", [ 'a', 'b']]
    - !Split [ "a", "abba" ]
    - !Sub "stringSubstitution"
    - !Sub [ "listSubstitution", {} ]
  `, { schema })
  t.equals(yaml.safeDump(data, {schema}), 
`test:
  - !<!And> 
    - a
    - b
    - c
  - !<!Base64> 
    Ref: LogicalId
  - !<!Base64> string
  - !<!Equals> 
    - a
    - b
  - !<!FindInMap> 
    - a
    - b
    - c
  - !<!If> 
    - a
    - b
    - c
  - !<!ImportValue> String
  - !<!ImportValue> 
    'Fn::Sub': string
  - !<!GetAtt> a.b
  - !<!GetAZs> String
  - !<!GetAZs> 
    Ref: 'AWS::Region'
  - !<!Join> 
    - ''
    - - a
      - b
      - c
  - !<!Not> 
    - !<!Equals> 
      - a
      - b
  - !<!Not> 
    - ''
  - !<!Or> 
    - a
    - b
  - !<!Ref> LogicalId
  - !<!Select> 
    - '1'
    - - a
      - b
  - !<!Split> 
    - a
    - abba
  - !<!Sub> stringSubstitution
  - !<!Sub> 
    - listSubstitution
    - {}
`, 'dump back to yaml')    

  t.end()
})
