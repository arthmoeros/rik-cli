const fs = require('fs');
const jsYaml = require('js-yaml');

let rik = {};
if(fs.existsSync('./.rik')){
  rik = jsYaml.load(fs.readFileSync('./.rik'));
}
module.exports = rik;