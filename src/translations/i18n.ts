import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { PageLanguageCodes } from '../types/language.types';
import adminEn from './en/admin.json';
import breadcrumbsEn from './en/breadcrumbs.json';
import commonEn from './en/common.json';
import disciplinesEn from './en/disciplines.json';
import feedbackEn from './en/feedback.json';
import languagesEn from './en/languages.json';
import profileEn from './en/profile.json';
import publicationEn from './en/publication.json';
import referenceTypesEn from './en/referenceTypes.json';
import translationsEn from './en/translations.json';
import workListsEn from './en/workLists.json';

import adminNb from './nb/admin.json';
import breadcrumbsNb from './nb/breadcrumbs.json';
import commonNb from './nb/common.json';
import disciplinesNb from './nb/disciplines.json';
import feedbackNb from './nb/feedback.json';
import languagesNb from './nb/languages.json';
import profileNb from './nb/profile.json';
import publicationNb from './nb/publication.json';
import referenceTypesNb from './nb/referenceTypes.json';
import translationsNb from './nb/translations.json';
import workListsNb from './nb/workLists.json';

export const defaultLanguage = PageLanguageCodes.NORWEGIAN_BOKMAL;

i18n.use(LanguageDetector).init({
  resources: {
    en: {
      admin: adminEn,
      breadcrumbs: breadcrumbsEn,
      common: commonEn,
      disciplines: disciplinesEn,
      languages: languagesEn,
      feedback: feedbackEn,
      profile: profileEn,
      publication: publicationEn,
      referenceTypes: referenceTypesEn,
      translations: translationsEn,
      workLists: workListsEn,
    },
    nb: {
      admin: adminNb,
      breadcrumbs: breadcrumbsNb,
      common: commonNb,
      disciplines: disciplinesNb,
      languages: languagesNb,
      feedback: feedbackNb,
      profile: profileNb,
      publication: publicationNb,
      referenceTypes: referenceTypesNb,
      translations: translationsNb,
      workLists: workListsNb,
    },
  },
  fallbackLng: defaultLanguage,
  debug: false,
  ns: ['breadcrumbs', 'common', 'languages', 'feedback', 'profile', 'translations'],
  defaultNS: 'translations',
  interpolation: {
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

export default i18n;
