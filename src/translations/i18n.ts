import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './enTranslations.json';
import nbTranslations from './nbTranslations.json';
import nnTranslations from './nnTranslations.json';
import { normalizeToIso6391, normalizeToIso6393 } from './translation-helpers';

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
  fallbackLng: (langCode) => [normalizeToIso6393(langCode), 'nob'], // Regardless of language code we want to map it to one of our three language files
  returnEmptyString: false,
  debug: false,
});

/* This code sets the local storage and language in the html */
if (typeof document !== 'undefined') {
  const displayLanguage = normalizeToIso6393(i18n.language);

  // We want ISO 639-3 code in local storage (i.e. "nob" instead of "no")
  try {
    if (localStorage.getItem('i18nextLng') !== displayLanguage) {
      localStorage.setItem('i18nextLng', displayLanguage);
    }
  } catch {}

  // We need the ISO 639-1 code standard for the html
  document.documentElement.lang = normalizeToIso6391(displayLanguage);

  i18n.on('languageChanged', (newLanguage) => {
    document.documentElement.lang = normalizeToIso6391(newLanguage);

    try {
      localStorage.setItem('i18nextLng', normalizeToIso6393(newLanguage));
    } catch {}
  });
}

export default i18n;
