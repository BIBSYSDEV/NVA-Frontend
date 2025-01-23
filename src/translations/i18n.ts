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
  contextSeparator: '__',
  fallbackLng: 'nob',
  returnEmptyString: false,
  supportedLngs: ['nob', 'eng', 'nno'],
  debug: false,
});

const getLanguageTagValue = (language: string) => {
  if (language === 'eng') {
    return 'en';
  }
  return 'no';
};

if (document) {
  // Set lang attribute on html element
  document.documentElement.lang = getLanguageTagValue(i18n.language);
  i18n.on('languageChanged', (newLanguage) => {
    document.documentElement.lang = getLanguageTagValue(newLanguage);
  });
}

export default i18n;
