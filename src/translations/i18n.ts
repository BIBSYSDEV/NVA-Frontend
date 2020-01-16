import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { LanguageCodes } from '../types/settings.types';
import breadcrumbsEn from './en/breadcrumbs.json';
import commonEn from './en/common.json';
import disciplinesEn from './en/disciplines.json';
import feedbackEn from './en/feedback.json';
import profileEn from './en/profile.json';
import publicationEn from './en/publication.json';
import translationsEn from './en/translations.json';
import breadcrumbsNb from './nb/breadcrumbs.json';
import commonNb from './nb/common.json';
import disciplinesNb from './nb/disciplines.json';
import feedbackNb from './nb/feedback.json';
import profileNb from './nb/profile.json';
import publicationNb from './nb/publication.json';
import translationsNb from './nb/translations.json';

export const defaultLanguage = LanguageCodes.NORWEGIAN_BOKMAL;

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      feedback: feedbackEn,
      translations: translationsEn,
      common: commonEn,
      profile: profileEn,
      disciplines: disciplinesEn,
      breadcrumbs: breadcrumbsEn,
      publication: publicationEn,
    },
    nb: {
      feedback: feedbackNb,
      translations: translationsNb,
      common: commonNb,
      profile: profileNb,
      disciplines: disciplinesNb,
      breadcrumbs: breadcrumbsNb,
      publication: publicationNb,
    },
  },
  fallbackLng: defaultLanguage,
  debug: false,
  ns: ['common', 'feedback', 'translations', 'profile', 'breadcrumbs'],
  defaultNS: 'translations',
  interpolation: {
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

//TODO: RENAME TO f.ex. USER_LANGUAGES
export const languages = [
  {
    name: 'English',
    code: LanguageCodes.ENGLISH,
  },
  {
    name: 'Norsk (bokmål)',
    code: LanguageCodes.NORWEGIAN_BOKMAL,
  },
];

export default i18n;
