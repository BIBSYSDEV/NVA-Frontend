import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './enTranslations.json';
import nbTranslations from './nbTranslations.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translation: enTranslations,
    },
    nob: {
      translation: nbTranslations,
    },
  },
  fallbackLng: 'nob',
  supportedLngs: ['nob', 'eng'],
  debug: false,
});

export default i18n;
