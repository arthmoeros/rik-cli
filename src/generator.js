const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const templates = require('./template-manager');

function _writeTo(template, params, targetPath) {
  const contents = template(params);
  fs.writeFileSync(targetPath, contents);
}

function init(params) {
  const isMultiImpl = params.project.resource.type === 'multi-implementation';
  const versionPath = path.join(params.project.path, 'v1');
  const initResourcePath = path.join(versionPath, 'resources', params.project.resource.name);
  shelljs.mkdir('-p', initResourcePath);
  shelljs.mkdir('-p', path.join(initResourcePath, 'schemas'));

  if (isMultiImpl) {
    shelljs.mkdir('-p', path.join(initResourcePath, 'impl'));
    _writeTo(
      templates.tmplResourceController,
      params.project,
      path.join(initResourcePath, 'impl', 'default.js')
    );
    _writeTo(
      templates.tmplResourceControllerMultiImpl,
      params.project,
      path.join(initResourcePath, 'controller.js')
    );
  } else {
    _writeTo(
      templates.tmplResourceController,
      params.project,
      path.join(initResourcePath, 'controller.js')
    );
  }

  params.project.resource.verbs.forEach((verb) => {
    _writeTo(
      templates.tmplJOIYMLSchema,
      {
        verb,
        isRequest: true
      },
      path.join(initResourcePath, 'schemas', `${verb}.request.yml`)
    );
    _writeTo(
      templates.tmplJOIYMLSchema,
      {
        verb,
        isRequest: false
      },
      path.join(initResourcePath, 'schemas', `${verb}.response.yml`)
    );
  });

  _writeTo(
    templates.tmplHealthcheck,
    {},
    path.join(initResourcePath, `healthcheck.yml`)
  )

  _writeTo(
    templates.tmplRIKCustomizationVersion,
    {},
    path.join(versionPath, `rik-customization.js`)
  )

  _writeTo(
    templates.tmplRIKCustomizationGlobal,
    {},
    path.join(params.project.path, `rik-customization.js`)
  )

  _writeTo(
    templates.tmplSettings,
    params,
    path.join(params.project.path, `settings.yml`)
  )

  _writeTo(
    templates.tmplDotRIK,
    params,
    path.join('.', `.rik`)
  )
}

function resource(config, params) {
  const isMultiImpl = params.resource.type === 'multi-implementation';
  const versionPath = path.join(config.project.path, params.resource.version);
  const resourcePath = path.join(versionPath, 'resources', params.resource.name);
  shelljs.mkdir('-p', resourcePath);
  shelljs.mkdir('-p', path.join(resourcePath, 'schemas'));

  if (isMultiImpl) {
    shelljs.mkdir('-p', path.join(resourcePath, 'impl'));
    _writeTo(
      templates.tmplResourceController,
      params,
      path.join(resourcePath, 'impl', 'default.js')
    );
    _writeTo(
      templates.tmplResourceControllerMultiImpl,
      params,
      path.join(resourcePath, 'controller.js')
    );
  } else {
    _writeTo(
      templates.tmplResourceController,
      params,
      path.join(resourcePath, 'controller.js')
    );
  }

  params.resource.verbs.forEach((verb) => {
    _writeTo(
      templates.tmplJOIYMLSchema,
      {
        verb,
        isRequest: true
      },
      path.join(resourcePath, 'schemas', `${verb}.request.yml`)
    );
    _writeTo(
      templates.tmplJOIYMLSchema,
      {
        verb,
        isRequest: false
      },
      path.join(resourcePath, 'schemas', `${verb}.response.yml`)
    );
  });

  _writeTo(
    templates.tmplHealthcheck,
    {},
    path.join(resourcePath, `healthcheck.yml`)
  )
}

module.exports = {
  init,
  resource
};