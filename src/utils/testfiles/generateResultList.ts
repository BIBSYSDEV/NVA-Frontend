import { Resource, resourceType } from '../../types/resource.types';

const faker = require('faker');
const fs = require('fs');

const NUMBER_OF_RESOURCES = 45;

const generateRandomResourceType = () =>
  faker.helpers.replaceSymbolWithNumber(faker.random.arrayElement(Object.getOwnPropertyNames(resourceType)));

const convertToSentence = (sentence: string) => sentence.charAt(0).toUpperCase() + sentence.slice(1);

const generateResources: any = () => {
  let resources: Resource[] = [];
  for (let i = 0; i < NUMBER_OF_RESOURCES; i++) {
    let resource: any = {};
    resource.creators = [];
    let numberOfAuthors = Math.floor(Math.random() * 9) + 1;
    for (let j = 1; j < numberOfAuthors; j++) {
      let creator = faker.name.lastName() + ', ' + faker.name.firstName();
      resource.creators.push(creator);
    }
    resource.handle = 'http:/hndl.net/' + faker.random.number({ min: 10000 });
    resource.license = 'UNIT_CCBY';
    let fakeDate = faker.date.past(500, '2100-01-01');
    resource.publicationYear = fakeDate.getFullYear();
    resource.publisher = faker.company.companyName();
    resource.titles = {
      no: convertToSentence(faker.company.bs()),
      en: convertToSentence(faker.company.bs()),
    };

    resource.type = generateRandomResourceType();
    resources.push(resource);
  }
  return resources;
};

const resultAsString = JSON.stringify(generateResources(), null, '  ');
fs.writeFileSync('./resources_45_random_results_generated.json', resultAsString);
