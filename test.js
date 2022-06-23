'use strict';

const schema = require('./index.js');
const yaml = require('js-yaml');
const test = require('tape');

test('yaml parser should', function (t) {
  t.deepLooseEqual(
    yaml.load(`test: !And [ 'a', 'b', { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::And': [ 'a', 'b', { Ref: 'logicalId' }]}},
    'parse !And'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Base64 { Ref: 'logicalId'}`, { schema }),
    { test: { 'Fn::Base64': { Ref: 'logicalId' }}},
    'parse !Base64 object params'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Base64 SomeString`, { schema }),
    { test: { 'Fn::Base64': 'SomeString' } },
    'parse !Base64 string params'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Equals [ 'a', 'b' ]`, { schema }),
    { test: { 'Fn::Equals': [ 'a', 'b' ]}},
    'parse !Equals'
  )

  t.deepLooseEqual(
    yaml.load(`test: !FindInMap [ 'a', 'b', { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::FindInMap': [ 'a', 'b', { Ref: 'logicalId' }]}},
    'parse !FindInMap'
  )

  t.deepLooseEqual(
    yaml.load(`test: !GetAtt logicalId.attribute`, { schema }),
    { test: { 'Fn::GetAtt': [ 'logicalId', 'attribute' ]}},
    'parse !GetAtt string params'
  )

  t.deepLooseEqual(
    yaml.load(`test: !GetAtt [ logicalId, attribute ] `, { schema }),
    { test: { 'Fn::GetAtt': [ 'logicalId', 'attribute' ]}},
    'parse !GetAtt array params'
  )

  t.deepLooseEqual(
    yaml.load(`test: !GetAZs region`, { schema }),
    { test: { 'Fn::GetAZs': 'region' }},
    'parse !GetAZs string param'
  )

  t.deepLooseEqual(
    yaml.load(`test: !GetAZs { Ref: AWS::Region}`, { schema }),
    { test: { 'Fn::GetAZs': { Ref: 'AWS::Region' }}},
    'parse !GetAZs object param'
  )

  t.deepLooseEqual(
    yaml.load(`test: !If [ 'a', 'b', { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::If': [ 'a', 'b', { Ref: 'logicalId' }]}},
    'parse !If'
  )

  t.deepLooseEqual(
    yaml.load(`test: !ImportValue value`, { schema }),
    { test: { 'Fn::ImportValue': 'value' }},
    'parse !ImportValue string param'
  )

  t.deepLooseEqual(
    yaml.load(`test: !ImportValue { Fn::Sub: String}`, { schema }),
    { test: { 'Fn::ImportValue': { 'Fn::Sub': 'String' }}},
    'parse !ImportValue object param'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Join [ 'a', ['b','c'] ]`, { schema }),
    { test: { 'Fn::Join': [ 'a', ['b', 'c' ] ]}},
    'parse !Join'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Not [ { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::Not': [ { Ref: 'logicalId' }]}},
    'parse !Not'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Or [ 'a', 'b', { Ref: 'logicalId'}]`, { schema }),
    { test: { 'Fn::Or': [ 'a', 'b', { Ref: 'logicalId' }]}},
    'parse !Or'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Ref logicalId`, { schema }),
    { test: { Ref: 'logicalId' }},
    'parse !Ref'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Select [ '1', ['b','c'] ]`, { schema }),
    { test: { 'Fn::Select': [ '1', ['b', 'c' ] ]}},
    'parse !Select with 2nd param array'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Select [ '2', {Ref: 'logicalId' } ]`, { schema }),
    { test: { 'Fn::Select': [ '2', {Ref: 'logicalId' } ]}},
    'parse !Select with 2nd param object'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Split [ '1', ['b','c'] ]`, { schema }),
    { test: { 'Fn::Split': [ '1', ['b', 'c' ] ]}},
    'parse !Split with 2nd param array'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Split [ '2', {Ref: 'logicalId' } ]`, { schema }),
    { test: { 'Fn::Split': [ '2', {Ref: 'logicalId' } ]}},
    'parse !Split with 2nd param object'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Sub [ 'string', {} ]`, { schema }),
    { test: { 'Fn::Sub': [ 'string', {} ]}},
    'parse !Sub array param'
  )

  t.deepLooseEqual(
    yaml.load(`test: !Sub string`, { schema }),
    { test: { 'Fn::Sub': 'string' }},
    'parse !Sub string param'
  )

  // dumper test
  let data = yaml.load(`
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
    - !Join [ "", !Ref something]
    - !Not [ !Equals ["a", "b" ]]
    - !Not [""]
    - !Or ['a', 'b']
    - !Ref LogicalId
    - !Select [ "1", [ 'a', 'b']]
    - !Split [ "a", "abba" ]
    - !Sub "stringSubstitution"
    - !Sub [ "listSubstitution", {} ]
  `, { schema })
  t.equals(yaml.dump(data, {schema}).split('\n').map(s => s.trimEnd()).join('\n'),
`test:
  - !And
    - a
    - b
    - c
  - !Base64
    Ref: LogicalId
  - !Base64 string
  - !Equals
    - a
    - b
  - !FindInMap
    - a
    - b
    - c
  - !If
    - a
    - b
    - c
  - !ImportValue String
  - !ImportValue
    Fn::Sub: string
  - !GetAtt a.b
  - !GetAZs String
  - !GetAZs
    Ref: AWS::Region
  - !Join
    - ''
    - - a
      - b
      - c
  - !Join
    - ''
    - !Ref something
  - !Not
    - !Equals
      - a
      - b
  - !Not
    - ''
  - !Or
    - a
    - b
  - !Ref LogicalId
  - !Select
    - '1'
    - - a
      - b
  - !Split
    - a
    - abba
  - !Sub stringSubstitution
  - !Sub
    - listSubstitution
    - {}
`, 'dump back to yaml')

  t.end()
})
