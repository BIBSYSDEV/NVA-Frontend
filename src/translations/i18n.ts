import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './enTranslations.json';
import nbTranslations from './nbTranslations.json';
import nnTranslations from './nnTranslations.json';

const handledLanguages = [
  'nob', // Norwegian Bokmål,
  'nb', // Norwegian Bokmål
  'eng', // English
  'en', // English
  'nn', // Norwegian Nynorsk
  'nno', // Norwegian Nynorsk
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
  fallbackLng: (langCode) => {
    if (!handledLanguages.includes(langCode) || langCode === 'en' || langCode === 'eng') {
      // When the user's browser language is not Norwegian (Bokmål, Nynorsk, or any Sami variant), then the service should display in English by default
      return ['eng'];
    } else if (langCode === 'nn' || langCode === 'nno') {
      return ['nno'];
    }
    return ['nob']; // When the user's browser language is not specified, and when Bokmål is selected, then the service should display in Bokmål
  },
  returnEmptyString: false,
  debug: false,
});

const getLanguageTagValue = (language: string) => {
  if (language === 'eng') {
    return 'en';
  }
  return 'no';
};

if (typeof document !== 'undefined') {
  document.documentElement.lang = getLanguageTagValue(i18n.language);
  i18n.on('languageChanged', (newLanguage) => {
    document.documentElement.lang = getLanguageTagValue(newLanguage);
  });
}

export default i18n;
