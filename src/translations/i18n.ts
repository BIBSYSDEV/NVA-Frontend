import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { Language } from '../types/settings.types';
import feedbackEn from './en/feedback.json';
import translationsEn from './en/translations.json';
import feedbackNb from './nb/feedback.json';
import translationsNb from './nb/translations.json';
import disciplinesNb from './nb/disciplines.json';
import disciplinesEn from './en/disciplines.json';
import commonEn from './en/common.json';
import commonNb from './nb/common.json';
import breadcrumbsEn from './en/breadcrumbs.json';
import breadcrumbsNb from './nb/breadcrumbs.json';

export const defaultLanguage = Language.NORWEGIAN_BOKMAL;

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      feedback: feedbackEn,
      translations: translationsEn,
      common: commonEn,
      disciplines: disciplinesEn,
      breadcrumbs: breadcrumbsEn,
    },
    nb: {
      feedback: feedbackNb,
      translations: translationsNb,
      common: commonNb,
      disciplines: disciplinesNb,
      breadcrumbs: breadcrumbsNb,
    },
  },
  fallbackLng: defaultLanguage,
  debug: false,
  ns: ['common', 'feedback', 'translations', 'breadcrumbs'],
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
