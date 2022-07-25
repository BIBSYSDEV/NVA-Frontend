import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import adminEn from './en/admin.json';
import authorizationEn from './en/authorization.json';
import basicDataEn from './en/basicData.json';
import institutionEn from './en/institution.json';
import projectEn from './en/project.json';
import publicationTypesEn from './en/publicationTypes.json';
import searchEn from './en/search.json';
import workListsEn from './en/workLists.json';

import nb from './nb.json';
import adminNb from './nb/admin.json';
import authorizationNb from './nb/authorization.json';
import basicDataNb from './nb/basicData.json';
import institutionNb from './nb/institution.json';
import projectNb from './nb/project.json';
import publicationTypesNb from './nb/publicationTypes.json';
import searchNb from './nb/search.json';
import workListsNb from './nb/workLists.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translations: en,
      admin: adminEn,
      authorization: authorizationEn,
      basicData: basicDataEn,
      institution: institutionEn,
      project: projectEn,
      publicationTypes: publicationTypesEn,
      search: searchEn,
      workLists: workListsEn,
    },
    nob: {
      translations: nb,
      admin: adminNb,
      authorization: authorizationNb,
      basicData: basicDataNb,
      institution: institutionNb,
      project: projectNb,
      publicationTypes: publicationTypesNb,
      search: searchNb,
      workLists: workListsNb,
    },
  },
  fallbackLng: 'nob',
  debug: false,
  ns: ['admin', 'authorization', 'infopages', 'institution', 'publicationTypes', 'workLists'],
  defaultNS: 'translations',
  supportedLngs: ['nob', 'eng'],
  interpolation: {
    formatSeparator: ',',
  },
});

export default i18n;
