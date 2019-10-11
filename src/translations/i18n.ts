import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { Language } from '../types/settings.types';
import translationsEn from './en/translations.json';
import translationsNb from './nb/translations.json';

export const defaultLanguage = Language.NORWEGIAN_BOKMAL;

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      translations: translationsEn,
    },
    nb: {
      translations: translationsNb,
    },
  },
  fallbackLng: defaultLanguage,
  debug: true,
  ns: ['translations'],
  defaultNS: 'translations',
  keySeparator: false,
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
