import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import engTranslations from './engTranslations.json';
import nobTranslations from './nobTranslations.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translation: engTranslations,
    },
    nob: {
      translation: nobTranslations,
    },
  },
  fallbackLng: 'nob',
  supportedLngs: ['nob', 'eng'],
  debug: false,
});

export default i18n;
