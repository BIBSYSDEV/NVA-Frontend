import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './enTranslations.json';
import nbTranslations from './nbTranslations.json';
import nnTranslations from './nnTranslations.json';

export const samiLanguageCodes = [
  'smi', // General for all sami languages
  'se', // Northern Sami
  'sme', // Northern Sami
  'sma', // Southern Sami
  'smj', // Lule Sami
  'smn', // Inari Sami
  'sms', // Skolt Sami
  'sje', // Pite Sami
  'sju', // Ume Sami
  'sjd', // Kildin Sami
  'sjt', // Ter Sami
];

const norwegianBokmaalLanguages = ['nob', 'nb', 'nb-NO', 'no', 'no-NO'];
const norwegianNynorskLanguages = ['nn', 'nno', 'nn-NO'];
const englishLanguages = ['eng', 'en', 'en-US', 'en-GB'];

const handledLanguages = [
  ...englishLanguages,
  ...norwegianBokmaalLanguages,
  ...norwegianNynorskLanguages,
  ...samiLanguageCodes,
];

export const selectDisplayLanguage = (langCode: string | undefined | null) => {
  // Might be a string because it might come from a cookie
  if (langCode === 'undefined' || langCode === 'null' || langCode === undefined || langCode === null) {
    return 'nob'; // When the user's language is not specified, then the service should display in Bokmål
  } else if (englishLanguages.includes(langCode) || !handledLanguages.includes(langCode)) {
    // When the selected language is english or a language that is not handled, then the service should display in English by default
    return 'eng';
  } else if (norwegianNynorskLanguages.includes(langCode)) {
    return 'nno';
  }
  return 'nob';
};

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
  fallbackLng: (langCode) => selectDisplayLanguage(langCode),
  returnEmptyString: false,
  debug: false,
});

const getLanguageTagValue = (language: 'eng' | 'nob' | 'nno') => {
  if (language === 'eng') {
    return 'en';
  } else if (language === 'nno') {
    return 'nn';
  }
  return 'no';
};

if (typeof document !== 'undefined') {
  document.documentElement.lang = getLanguageTagValue(selectDisplayLanguage(i18n.language));
  i18n.on('languageChanged', (newLanguage) => {
    document.documentElement.lang = getLanguageTagValue(selectDisplayLanguage(newLanguage));
  });
}

export default i18n;
