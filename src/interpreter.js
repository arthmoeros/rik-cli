#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const generator = require('./generator');
const config = require('./config');
const { ncpp } = require('./util');

const REGEX_API_VERSION = /v[0-9]*/;

async function cmdInit() {
  console.log("RIK Command Line Interface -- Init --");
  const questions = [
    {
      type: 'input',
      default: './app/rik',
      name: 'project.path',
      message: 'Specify the RIK project Path where the folder structure will be generated:',
      validate: (input) => {
        if (fs.existsSync(input)) {
          return 'Specified path already exists';
        } else if (input.trim().length === 0) {
          return 'Path cannot be empty';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'project.apiVersionMode',
      choices: [
        'path',
        'header'
      ],
      message: 'Select the API version mode for the project\n\t*path*: Manages versioning in the URL "/api/v1/etc"\n\t*header*: Manages versioning via header "accept-version: v1"\n:'
    },
    {
      type: 'list',
      default: 'basic',
      name: 'project.resource.type',
      choices: [
        'basic',
        'multi-implementation'
      ],
      message: 'Select the initial Resource pattern\n\t*basic*: Plain Controller Resource\n\t*multi-implementation*: Resolved Controller Resource Pattern\n:'
    },
    {
      type: 'input',
      name: 'project.resource.name',
      message: 'Specify the initial Resource name:',
      validate: (input) => input.trim().length > 0 ? true : 'Resource name cannot be empty'
    },
    {
      type: 'checkbox',
      name: 'project.resource.verbs',
      choices: [
        'get',
        'post',
        'patch',
        'delete'
      ],
      message: 'Select which verbs will be supported on the initial Resource:'
    }
  ];
  const prompt = inquirer.createPromptModule();
  let answers = await prompt(questions);
  console.log(`Bootstraping your RIK project at ${answers.project.path}`);
  generator.init(answers);
  console.log(`Written project metadata to "${path.join(process.cwd(),'.rik')}", this file is expected by the "resource" and "version" commands`);
}

async function cmdResource() {
  console.log("RIK Command Line Interface -- Resource --");
  if (config.project === undefined || !fs.existsSync(config.project.path)) {
    throw "ERROR: RIK is not initialized or the project folder is missing";
  }
  console.log(`Working with RIK project at ${config.project.path}`)
  let availableVersions = fs.readdirSync(config.project.path)
    .filter(
      (folder) => fs.lstatSync(path.join(config.project.path, folder)).isDirectory() && REGEX_API_VERSION.test(folder));
  availableVersions = availableVersions.sort();
  availableVersions = availableVersions.reverse();
  const questions = [
    {
      type: 'list',
      name: 'resource.version',
      default: availableVersions[0],
      choices: availableVersions,
      message: 'Select the target version of the new resource:'
    },
    {
      type: 'input',
      name: 'resource.name',
      message: 'Specify the name of the Resource:',
      validate: (input, answers) => {
        if (fs.existsSync(path.join(config.project.path, answers.resource.version, 'resources', input))) {
          return 'Resource already exists for selected version';
        } else if (input.trim().length === 0) {
          return 'Resource name cannot be empty';
        }
        return true;
      }
    },
    {
      type: 'list',
      default: 'basic',
      name: 'resource.type',
      choices: [
        'basic',
        'multi-implementation'
      ],
      message: 'Select the Resource pattern\n\t*basic*: Plain Controller Resource\n\t*multi-implementation*: Resolved Controller Resource Pattern\n:'
    },
    {
      type: 'checkbox',
      name: 'resource.verbs',
      choices: [
        'get',
        'post',
        'patch',
        'delete'
      ],
      message: 'Select which verbs will be supported on the Resource:'
    }
  ];
  const prompt = inquirer.createPromptModule();
  let answers = await prompt(questions);
  console.log(`Generating new Resource at ${config.project.path}/${answers.resource.version}/resources/${answers.resource.name}`);
  generator.resource(config, answers);
}

async function cmdVersion() {
  console.log("RIK Command Line Interface -- Resource --");
  if (config.project === undefined || !fs.existsSync(config.project.path)) {
    throw "ERROR: RIK is not initialized or the project folder is missing";
  }
  console.log(`Working with RIK project at ${config.project.path}`)
  let availableVersions = fs.readdirSync(config.project.path)
    .filter(
      (folder) => fs.lstatSync(path.join(config.project.path, folder)).isDirectory() && REGEX_API_VERSION.test(folder));
  availableVersions = availableVersions.sort();
  availableVersions = availableVersions.reverse();
  const latestVersion = availableVersions[0];
  const nextVersion = `v${parseInt(latestVersion.substring(1)) + 1}`;

  const questions = [
    {
      type: 'confirm',
      name: 'version.confirm',
      message: `This will make a deep copy of latest version "${latestVersion}" to new version "${nextVersion}", proceed?`
    }
  ];
  const prompt = inquirer.createPromptModule();
  let answers = await prompt(questions);
  if (answers.version.confirm) {
    console.log("Promoting new version");
    await ncpp(path.join(config.project.path, latestVersion), path.join(config.project.path, nextVersion));
  } else {
    console.log("Canceled");
  }
}

async function cmdHelp() {
  console.log("RIK Command Line Interface -- Help --");
  console.log("Usage: rik <command>");
  console.log("");
  console.log("Commands:");
  console.log("  init      Bootstraps a new RIK project in the current folder");
  console.log("  resource  Creates a new Resource in the current RIK project");
  console.log("  version   Promotes a new API version in the current RIK project, deep copy from the latest version folder");
  console.log("");
}

const command = process.argv[2];
let functionCall;
if (command === 'init') {
  functionCall = cmdInit;
} else if (command === 'resource') {
  functionCall = cmdResource;
} else if (command === 'version') {
  functionCall = cmdVersion;
} else {
  functionCall = cmdHelp;
}

functionCall().then(() => {
  console.log('Done!');
}).catch((err) => {
  console.log(`An error ocurred: ${err}`);
});