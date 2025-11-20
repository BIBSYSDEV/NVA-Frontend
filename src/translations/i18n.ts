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

export const selectIso6392LanguageCode = (langCode: string | undefined | null) => {
  // Might be a string because it might come from local storage
  if (langCode === 'undefined' || langCode === 'null' || !langCode) {
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
  fallbackLng: (langCode) => selectIso6392LanguageCode(langCode), // Regardless of language code we want to map it to one of our three language files
  returnEmptyString: false,
  debug: false,
});

const convertToIso6391LanguageCode = (language: 'eng' | 'nob' | 'nno') => {
  if (language === 'eng') {
    return 'en';
  } else if (language === 'nno') {
    return 'nn';
  }
  return 'no';
};

/* This code sets the local storage and language in the html */
if (typeof document !== 'undefined') {
  const displayLanguage = selectIso6392LanguageCode(i18n.language);

  // We want a three letter language code in local storage (i.e. "nob" instead of "no")
  try {
    if (localStorage.getItem('i18nextLng') !== displayLanguage) {
      localStorage.setItem('i18nextLng', displayLanguage);
    }
  } catch {}

  // We need the two letter standard for the html
  document.documentElement.lang = convertToIso6391LanguageCode(displayLanguage);

  i18n.on('languageChanged', (newLanguage) => {
    const newDisplayLanguage = selectIso6392LanguageCode(newLanguage);
    document.documentElement.lang = convertToIso6391LanguageCode(newDisplayLanguage);

    try {
      localStorage.setItem('i18nextLng', newDisplayLanguage);
    } catch {}
  });
}

export default i18n;
