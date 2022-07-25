import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import authorizationEn from './en/authorization.json';

import nb from './nb.json';
import authorizationNb from './nb/authorization.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translations: en,
      authorization: authorizationEn,
    },
    nob: {
      translations: nb,
      authorization: authorizationNb,
    },
  },
  fallbackLng: 'nob',
  debug: false,
  ns: ['authorization'],
  defaultNS: 'translations',
  supportedLngs: ['nob', 'eng'],
  interpolation: {
    formatSeparator: ',',
  },
});

export default i18n;
