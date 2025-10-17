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
  'sjt', // Ter Sami;
];

const handledLanguages = [
  'nob', // Norwegian Bokmål,
  'nb', // Norwegian Bokmål
  'eng', // English
  'en', // English
  'nn', // Norwegian Nynorsk
  'nno', // Norwegian Nynorsk
  ...samiLanguageCodes,
];

export const selectDisplayLanguage = (langCode: string) => {
  if (langCode === 'undefined' || langCode === 'null' || langCode === undefined || langCode === null) {
    return 'nob'; // When the user's language is not specified, then the service should display in Bokmål
  } else if (langCode === 'en' || langCode === 'eng' || !handledLanguages.includes(langCode)) {
    // When the selected language is not Norwegian (Bokmål, Nynorsk, or any Sami variant), then the service should display in English by default
    return 'eng';
  } else if (langCode === 'nn' || langCode === 'nno') {
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
  fallbackLng: (langCode) => [selectDisplayLanguage(langCode)],
  returnEmptyString: false,
  debug: false,
});

const getLanguageTagValue = (language: string) => {
  if (language === 'eng' || language === 'en') {
    return 'en';
  } else if (language === 'nn' || language === 'nno') {
    return 'nn';
  }
  return 'no';
};

if (typeof document !== 'undefined') {
  document.documentElement.lang = getLanguageTagValue(selectDisplayLanguage(i18n.language));
  i18n.on('languageChanged', (newLanguage) => {
    document.documentElement.lang = getLanguageTagValue(newLanguage);
  });
}

export default i18n;
