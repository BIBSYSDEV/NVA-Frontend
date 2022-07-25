import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import nb from './nb.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translations: en,
    },
    nob: {
      translations: nb,
    },
  },
  fallbackLng: 'nob',
  debug: false,
  defaultNS: 'translations',
  supportedLngs: ['nob', 'eng'],
  interpolation: {
    formatSeparator: ',',
  },
});

export default i18n;
