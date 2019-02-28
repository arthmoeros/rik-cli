const inquirer = require('inquirer');

async function cmdInit(){
  console.log("RIK Command Line Interface -- INIT --");
  const questions = [
    {
      type: 'input',
      default: './app/rik',
      name: 'rikProjectPath',
      message: 'Specify the RIK project Path where the folder structure will be generated:'
    },
    {
      type: 'list',
      default: 'basic',
      name: 'initialResourceType',
      choices: [
        'basic',
        'multi-implementation'
      ],
      message: 'Select the initial Resource type\n\t*basic*: Plain Controller Resource\n\t*multi-implementation*: Resolved Controller Resource Pattern\n:'
    },
    {
      type: 'input',
      name: 'initialResourceName',
      message: 'Specify the name of the initial Resource:',
      validate: (input) => input.trim().length > 0
    },
    {
      type: 'checkbox',
      name: 'initialResourceVerbs',
      choices: [
        'get',
        'post',
        'patch',
        'delete'
      ],
      message: 'Select which verbs will be supported on the initial Resource:'
    }
  ]
  const prompt = inquirer.createPromptModule();
  let answers = await prompt(questions);
  console.log(answers);
  console.log(`Bootstraping your RIK project at ${answers.rikProjectPath}`);
  
}

async function cmdResource(){

}

async function cmdHelp(){
  console.log("RIK Command Line Interface -- HELP --");
  console.log("Usage: rik <command>");
  console.log("");
  console.log("Commands:");
  console.log("  init      Bootstraps a new RIK project in the current folder");
  console.log("  resource  Creates a new Resource in the current RIK project");
  console.log("");
}

const command = process.argv[2];
let functionCall;
if(command === 'init'){
  functionCall = cmdInit;
}else if(command === 'resource'){
  functionCall = cmdResource;
}else{
  functionCall = cmdHelp;
}

functionCall().then(() => {
  console.log('Complete!');
}).catch((err) => {
  console.log(`An error ocurred: ${err}`);
});