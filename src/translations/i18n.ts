import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './enTranslations.json';
import nbTranslations from './nbTranslations.json';
import nnTranslations from './nnTranslations.json';

const supportedLanguages = [
  'nob', // Norwegian Bokmål,
  'nb', // Norwegian Bokmål, other language code
  'nn', // Norwegian Nynorsk
  'eng', // English
  'en', // English, other language code
  'nno', // Norwegian Nynorsk, other language code
  'sme', // All below arw different sami languages
  'sma',
  'smj',
  'smn',
  'sms',
  'sje',
  'sju',
  'sjd',
  'sjt',
];

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translation: enTranslations,
    },
    en: {
      translation: enTranslations,
    },
    nob: {
      translation: nbTranslations,
    },
    nno: {
      translation: nnTranslations,
    },
    nb: {
      translation: nbTranslations,
    },
    nn: {
      translation: nnTranslations,
    },
    sme: {
      // When the user's browser language is a Sami variant, then the service should display in Bokmål
      translation: nbTranslations,
    },
    sma: {
      // Southern Sami
      translation: nbTranslations,
    },
    smj: {
      // Lule Sami
      translation: nbTranslations,
    },
    smn: {
      // Inari Sami
      translation: nbTranslations,
    },
    sms: {
      // Skolt Sami
      translation: nbTranslations,
    },
    sje: {
      // Pite Sami
      translation: nbTranslations,
    },
    sju: {
      // Ume Sami
      translation: nbTranslations,
    },
    sjd: {
      // Kildin Sami
      translation: nbTranslations,
    },
    sjt: {
      // Ter Sami
      translation: nbTranslations,
    },
  },
  contextSeparator: '__',
  fallbackLng: (langCode) => {
    if (!langCode) {
      // When the user's browser language is not specified, then the service should display in Bokmål
      return ['nob'];
    }
    if (!supportedLanguages.includes(langCode)) {
      // When the user's browser language is not Norwegian (Bokmål, Nynorsk, or any Sami variant), then the service should display in English by default
      return ['eng'];
    }
    // Supported language
    return [langCode];
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
