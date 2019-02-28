const path = require('path');
const fs = require('fs');
const ejs = require('ejs');

const TEMPLATES_PATH = path.join(__dirname,'../tmpl/component/');

const tmplJOIYMLSchema = ejs.compile(fs.readFileSync(path.join(TEMPLATES_PATH,'joi-yml-schema.yml.ejs')).toString());
const tmplResourceControllerMultiImpl = ejs.compile(fs.readFileSync(path.join(TEMPLATES_PATH,'resource-controller-multi-impl.js.ejs')).toString());
const tmplResourceController = ejs.compile(fs.readFileSync(path.join(TEMPLATES_PATH,'resource-controller.js.ejs')).toString());
const tmplRIKCustomizationGlobal = ejs.compile(fs.readFileSync(path.join(TEMPLATES_PATH,'rik-customization.global.js.ejs')).toString());
const tmplRIKCustomizationVersion = ejs.compile(fs.readFileSync(path.join(TEMPLATES_PATH,'rik-customization.version.js.ejs')).toString());
const tmplSettings = ejs.compile(fs.readFileSync(path.join(TEMPLATES_PATH,'settings.yml.ejs')).toString());

module.exports = {
  tmplJOIYMLSchema,
  tmplResourceControllerMultiImpl,
  tmplResourceController,
  tmplRIKCustomizationGlobal,
  tmplRIKCustomizationVersion,
  tmplSettings
};