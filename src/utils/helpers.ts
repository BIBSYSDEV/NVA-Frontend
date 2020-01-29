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
