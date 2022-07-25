import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import engTranslations from './engTranslations.json';
import nobTranslations from './nobTranslations.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translations: engTranslations,
    },
    nob: {
      translations: nobTranslations,
    },
  },
  fallbackLng: 'nob',
  debug: true,
  defaultNS: 'translations',
  supportedLngs: ['nob', 'eng'],
  interpolation: {
    formatSeparator: ',',
  },
});

export default i18n;
