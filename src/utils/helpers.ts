import { InstitutionName } from './../types/institution.types';
import i18n from '../translations/i18n';

// Method that retrieves the value of a (potentially) dotted keyString from a object
export const getObjectValueByFieldName = (object: any, keyString: string) => {
  return keyString.split('.').reduce((obj, key): any => obj && obj[key], object);
};

// Method that retrieves the name of an institution/organization based on selected language
export const selectInstitutionNameByLanguage = (institutionNames: InstitutionName[]) => {
  return institutionNames.filter(unitName => unitName.language === i18n.language)[0]?.name ?? institutionNames[0].name;
};

// Remove duplicates filtered by SCN
export const removeDuplicatesByScn = (list: any[]) => {
  return [...new Map(list.map(item => [item.systemControlNumber, item])).values()];
};

// Move items within an array
const arrayMoveMutate = (array: any[], from: number, to: number) => {
  const startIndex = to < 0 ? array.length + to : to;
  const item = array.splice(from, 1)[0];
  array.splice(startIndex, 0, item);
};

export const arrayMove = (array: any[], from: number, to: number) => {
  array = array.slice();
  arrayMoveMutate(array, from, to);
  return array;
};
