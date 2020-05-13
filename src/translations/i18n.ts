import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { LanguageCodes } from '../types/language.types';
import adminEn from './en/admin.json';
import breadcrumbsEn from './en/breadcrumbs.json';
import commonEn from './en/common.json';
import disciplinesEn from './en/disciplines.json';
import feedbackEn from './en/feedback.json';
import formikValuesEn from './en/formikValues.json';
import infopagesEn from './en/infopages.json';
import institutionEn from './en/institution.json';
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
import infopagesNb from './nb/infopages.json';
import institutionNb from './nb/institution.json';
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
      feedback: feedbackEn,
      formikValues: formikValuesEn,
      infopages: infopagesEn,
      institution: institutionEn,
      languages: languagesEn,
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
      feedback: feedbackNb,
      formikValues: formikValuesNb,
      infopages: infopagesNb,
      institution: institutionNb,
      languages: languagesNb,
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
  ns: ['breadcrumbs', 'common', 'feedback', 'infopages', 'languages', 'profile', 'translations'],
  defaultNS: 'translations',
  interpolation: {
    formatSeparator: ',',
  },
  react: {
    wait: true,
  },
});

// Seems like i18next require 4-letter languages for pluralization to work out of box, so we must add our own rules
// https://github.com/i18next/i18next/issues/1061#issuecomment-395528467
i18n.services.pluralResolver.addRule('nob', {
  numbers: [1, 2],
  plurals: (n: number) => Number(n !== 1),
});
i18n.services.pluralResolver.addRule('eng', {
  numbers: [1, 2],
  plurals: (n: number) => Number(n !== 1),
});

export default i18n;
