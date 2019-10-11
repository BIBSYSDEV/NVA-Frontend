import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationsEn from './en/translations.json';
import translationsNb from './nb/translations.json';

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      languageName: { name: 'English' },
      translations: translationsEn,
    },
    nb: {
      languageName: { name: 'Norsk bokmål' },
      translations: translationsNb,
    },
  },
  fallbackLng: 'nb',
  debug: true,
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
  interpolation: {
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

export default i18n;
