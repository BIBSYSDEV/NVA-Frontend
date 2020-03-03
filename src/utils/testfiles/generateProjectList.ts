export {}; // to get rid of --isolatedModules - error

const faker = require('faker');
const fs = require('fs');

const NUMBER_OF_PROJECTS = 3;
const convertToSentence = (sentence: string) => sentence.charAt(0).toUpperCase() + sentence.slice(1);

const generateProjectsArray: any = () => {
  let projects: any = [];
  for (let i = 0; i < NUMBER_OF_PROJECTS; i++) {
    let project: any = {};
    project.id = faker.random.number({ min: 100000, max: 909999 });
    project.name = convertToSentence(faker.company.bs());
    project.financedBy = faker.company.companyName();
    projects.push(project);
  }
  return projects;
};

const resultAsString = JSON.stringify(generateProjectsArray(), null, '  ');
fs.writeFileSync('./projects_random_generated.json', resultAsString);
