# Cloudformation Schema for use with js-yaml

Cloudformation supports custom yaml classes, e.g. `!Ref`, `!Sub`, `!If`, etc.
Yaml parsers will choke on these custom classes unless the classes are specified.
Use this library with `js-yaml` to parse cloudformation templates with these classes. The cloudformation classes are converted into objects that are similar to the non custom class syntax e.g. `Ref`, `Fn::Sub`, `Fn::If`

## Usage
```
const yaml = require('js-yaml');
const schema = require('cloudformation-schema-js-yaml');
const fs = require('fs');

let file = fs.readFileSync('somefile.yaml');
let data = yaml.safeLoad(file, { schema: schema});
```

## Example
sample.yaml
```
test:
  - !Ref someLogicalId
  - !Sub A string with a substitution ${someLogicalId}
```

Program extract
```
let file = fs.readFileSync('sample.yaml');
let data = yaml.safeLoad(file, { schema: schema});
console.log(data)
console.log('%j', data)
```

Output
```
{ test:
   [ Obj { Ref: 'someLogicalId' },
     Obj { 'Fn::Sub': 'A string with a substitution ${someLogicalId}' } ] }
{"test":[{"Ref":"someLogicalId"},{"Fn::Sub":"A string with a substitution ${someLogicalId}"}]}
```
## Dependencies
None

## Peer-dependencies
This this library is meant to be used with js-yaml it has a peer dependency of `js-yaml`

## Tests
`npm test`
