import { RegistrationSubtype } from '../types/publicationFieldNames';

const createSubtypeFilter = (subtypes: RegistrationSubtype[]) =>
  `(${subtypes.map((subtype) => `entityDescription.reference.publicationInstance="${subtype}"`).join(' OR ')})`;

export const createSearchQuery = (searchTerm: string, subtypes?: RegistrationSubtype[]) => {
  const textSearch = searchTerm ? `*${searchTerm}*` : '';
  const typeSearch = subtypes && subtypes.length > 0 ? createSubtypeFilter(subtypes) : '';

  if (!typeSearch) {
    return textSearch;
  } else if (!textSearch) {
    return typeSearch;
  } else {
    return `${typeSearch} AND *${searchTerm}*`;
  }
};
