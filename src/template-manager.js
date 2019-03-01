const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const TEMPLATES_PATH = path.join(__dirname,'../tmpl/component/');

const options = {
};

function gimmeTemplate(name){
  return ejs.compile(fs.readFileSync(path.join(TEMPLATES_PATH,name)).toString(), options);
}

const tmplJOIYMLSchema = gimmeTemplate('joi-yml-schema.yml.ejs');
const tmplResourceControllerMultiImpl = gimmeTemplate('resource-controller-multi-impl.js.ejs');
const tmplResourceController = gimmeTemplate('resource-controller.js.ejs');
const tmplRIKCustomizationGlobal = gimmeTemplate('rik-customization.global.js.ejs');
const tmplRIKCustomizationVersion = gimmeTemplate('rik-customization.version.js.ejs');
const tmplSettings = gimmeTemplate('settings.yml.ejs');
const tmplHealthcheck = gimmeTemplate('healthcheck.yml.ejs');
const tmplDotRIK = gimmeTemplate('dotrik.ejs');

module.exports = {
  tmplJOIYMLSchema,
  tmplResourceControllerMultiImpl,
  tmplResourceController,
  tmplRIKCustomizationGlobal,
  tmplRIKCustomizationVersion,
  tmplSettings,
  tmplHealthcheck,
  tmplDotRIK
};