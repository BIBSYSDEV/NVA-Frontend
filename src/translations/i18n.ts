import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { LanguageCodes } from '../types/language.types';
import adminEn from './en/admin.json';
import breadcrumbsEn from './en/breadcrumbs.json';
import commonEn from './en/common.json';
import disciplinesEn from './en/disciplines.json';
import feedbackEn from './en/feedback.json';
import formikValuesEn from './en/formikValues.json';
import languagesEn from './en/languages.json';
import profileEn from './en/profile.json';
import publicationEn from './en/publication.json';
import publicationTypesEn from './en/publicationTypes.json';
import translationsEn from './en/translations.json';
import workListsEn from './en/workLists.json';

import adminNb from './nb/admin.json';
import breadcrumbsNb from './nb/breadcrumbs.json';
import commonNb from './nb/common.json';
import disciplinesNb from './nb/disciplines.json';
import feedbackNb from './nb/feedback.json';
import formikValuesNb from './nb/formikValues.json';
import languagesNb from './nb/languages.json';
import profileNb from './nb/profile.json';
import publicationNb from './nb/publication.json';
import publicationTypesNb from './nb/publicationTypes.json';
import translationsNb from './nb/translations.json';
import workListsNb from './nb/workLists.json';

const previousLanguage = localStorage.getItem('i18nextLng');
export const defaultLanguage =
  previousLanguage && Object.values(LanguageCodes).includes(previousLanguage as LanguageCodes)
    ? previousLanguage
    : LanguageCodes.NORWEGIAN_BOKMAL;

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      admin: adminEn,
      breadcrumbs: breadcrumbsEn,
      common: commonEn,
      disciplines: disciplinesEn,
      languages: languagesEn,
      feedback: feedbackEn,
      formikValues: formikValuesEn,
      profile: profileEn,
      publication: publicationEn,
      publicationTypes: publicationTypesEn,
      translations: translationsEn,
      workLists: workListsEn,
    },
    nob: {
      admin: adminNb,
      breadcrumbs: breadcrumbsNb,
      common: commonNb,
      disciplines: disciplinesNb,
      languages: languagesNb,
      feedback: feedbackNb,
      formikValues: formikValuesNb,
      profile: profileNb,
      publication: publicationNb,
      publicationTypes: publicationTypesNb,
      translations: translationsNb,
      workLists: workListsNb,
    },
  },
  lng: defaultLanguage,
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
