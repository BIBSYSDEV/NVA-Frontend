import { Resource, emptyResource } from '../../types/resource.types';

const faker = require('faker');
const fs = require('fs');

function generateResources(): any {
  let resources: Resource[] = [];
  for (let id = 1; id <= 2; id++) {
    let resource: Resource = emptyResource;
    resource.identifier = faker.random.uuid();
    resource.title = faker.lorem.sentences(1);
    resource.submitter_email = faker.internet.email();
    resources.push(resource);
  }
  return resources;
}

const resultAsString = JSON.stringify(generateResources(), null, '  ');
//fs.writeFileSync('./data.json',resultAsString);

console.log(resultAsString);
