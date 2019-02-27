const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const tmplResourceControllerMultiImpl = ejs.compile(fs.readFileSync(path.join(__dirname,'../tmpl/component/resource-controller-multi-impl.js.ejs')).toString());

function generateResourceControllerMultiImpl(params){
  return tmplResourceControllerMultiImpl(params);
}
let p = {
  subresourceOf: 'pepito'
};
console.log(generateResourceControllerMultiImpl(p));