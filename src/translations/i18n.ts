import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './enTranslations.json';
import nbTranslations from './nbTranslations.json';
import nnTranslations from './nnTranslations.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translation: enTranslations,
    },
    nob: {
      translation: nbTranslations,
    },
    nno: {
      translation: nnTranslations,
    },
  },
  contextSeparator: '|',
  fallbackLng: 'nob',
  returnEmptyString: false,
  supportedLngs: ['nob', 'eng', 'nno'],
  debug: false,
});

export default i18n;
