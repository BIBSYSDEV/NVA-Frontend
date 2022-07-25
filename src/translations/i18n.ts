import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import authorizationEn from './en/authorization.json';
import institutionEn from './en/institution.json';

import nb from './nb.json';
import authorizationNb from './nb/authorization.json';
import institutionNb from './nb/institution.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translations: en,
      authorization: authorizationEn,
      institution: institutionEn,
    },
    nob: {
      translations: nb,
      authorization: authorizationNb,
      institution: institutionNb,
    },
  },
  fallbackLng: 'nob',
  debug: false,
  ns: ['authorization', 'institution'],
  defaultNS: 'translations',
  supportedLngs: ['nob', 'eng'],
  interpolation: {
    formatSeparator: ',',
  },
});

export default i18n;
