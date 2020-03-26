import { PublicationMetadata } from '../../types/publication.types';
import { PublicationType } from '../../types/publicationFieldNames';

const faker = require('faker');
const fs = require('fs');

const NUMBER_OF_PUBLICATIONS = 45;

const generateRandomPublicationType = () =>
  faker.helpers.replaceSymbolWithNumber(faker.random.arrayElement(Object.getOwnPropertyNames(PublicationType)));

const convertToSentence = (sentence: string) => sentence.charAt(0).toUpperCase() + sentence.slice(1);

const generatePublications: any = () => {
  let publications: PublicationMetadata[] = [];
  for (let i = 0; i < NUMBER_OF_PUBLICATIONS; i++) {
    let publication: any = {};
    publication.creators = [];
    let numberOfAuthors = Math.floor(Math.random() * 9) + 1;
    for (let j = 1; j < numberOfAuthors; j++) {
      let creator = faker.name.lastName() + ', ' + faker.name.firstName();
      publication.creators.push(creator);
    }
    publication.handle = 'http:/hndl.net/' + faker.random.number({ min: 10000 });
    publication.license = 'UNIT_CCBY';
    let fakeDate = faker.date.past(500, '2100-01-01');
    publication.publicationYear = fakeDate.getFullYear();
    publication.publisher = faker.company.companyName();
    publication.titles = {
      no: convertToSentence(faker.company.bs()),
      en: convertToSentence(faker.company.bs()),
    };

    publication.type = generateRandomPublicationType();
    publications.push(publication);
  }
  return publications;
};

const resultAsString = JSON.stringify(generatePublications(), null, '  ');
fs.writeFileSync('./publications_45_random_results_generated.json', resultAsString);
