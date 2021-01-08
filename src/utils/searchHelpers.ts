import { RegistrationSubtype } from '../types/publicationFieldNames';

interface PropertySearch {
  key: string;
  value: string;
}
interface SearchConfig {
  searchTerm?: string;
  subtypes?: RegistrationSubtype[];
  properties?: PropertySearch[];
}

const createSearchTermFilter = (searchTerm?: string) => (searchTerm ? `*${searchTerm}*` : '');

const createSubtypeFilter = (subtypes?: RegistrationSubtype[]) =>
  subtypes && subtypes.length > 0
    ? `(${subtypes.map((subtype) => `entityDescription.reference.publicationInstance="${subtype}"`).join(' OR ')})`
    : '';

const createPropertyFilter = (properties?: PropertySearch[]) =>
  properties && properties.length > 0
    ? `(${properties.map(({ key, value }) => `${key}="${value}"`).join(' OR ')})`
    : '';

export const createSearchQuery = (searchConfig: SearchConfig) => {
  const textSearch = createSearchTermFilter(searchConfig.searchTerm);
  const typeSearch = createSubtypeFilter(searchConfig.subtypes);
  const propertySearch = createPropertyFilter(searchConfig.properties);

  const searchQuery = [textSearch, typeSearch, propertySearch].filter((search) => !!search).join(' AND ');
  return searchQuery;
};
