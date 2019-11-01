import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { Language } from '../types/settings.types';
import feedbackEn from './en/feedback.json';
import translationsEn from './en/translations.json';
import feedbackNb from './nb/feedback.json';
import translationsNb from './nb/translations.json';

export const defaultLanguage = Language.NORWEGIAN_BOKMAL;

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      feedback: feedbackEn,
      translations: translationsEn,
    },
    nb: {
      feedback: feedbackNb,
      translations: translationsNb,
    },
  },
  fallbackLng: defaultLanguage,
  debug: false,
  ns: ['feedback', 'translations'],
  defaultNS: 'translations',
  interpolation: {
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

export const languages = [
  {
    name: 'English',
    code: Language.ENGLISH,
  },
  {
    name: 'Norsk (bokmål)',
    code: Language.NORWEGIAN_BOKMAL,
  },
];

export default i18n;
