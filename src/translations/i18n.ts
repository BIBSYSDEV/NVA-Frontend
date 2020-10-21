import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { LanguageCodes } from '../types/language.types';
import adminEn from './en/admin.json';
import authorizationEn from './en/authorization.json';
import commonEn from './en/common.json';
import disciplinesEn from './en/disciplines.json';
import feedbackEn from './en/feedback.json';
import formikValuesEn from './en/formikValues.json';
import infopagesEn from './en/infopages.json';
import institutionEn from './en/institution.json';
import languagesEn from './en/languages.json';
import licensesEn from './en/licenses.json';
import profileEn from './en/profile.json';
import publicationTypesEn from './en/publicationTypes.json';
import registrationEn from './en/registration.json';
import translationsEn from './en/translations.json';
import workListsEn from './en/workLists.json';

import adminNb from './nb/admin.json';
import authorizationNb from './nb/authorization.json';
import commonNb from './nb/common.json';
import disciplinesNb from './nb/disciplines.json';
import feedbackNb from './nb/feedback.json';
import formikValuesNb from './nb/formikValues.json';
import infopagesNb from './nb/infopages.json';
import institutionNb from './nb/institution.json';
import languagesNb from './nb/languages.json';
import licensesNb from './nb/licenses.json';
import profileNb from './nb/profile.json';
import publicationTypesNb from './nb/publicationTypes.json';
import registrationNb from './nb/registration.json';
import translationsNb from './nb/translations.json';
import workListsNb from './nb/workLists.json';

export const fallbackLanguage = LanguageCodes.NORWEGIAN_BOKMAL;

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      admin: adminEn,
      authorization: authorizationEn,
      common: commonEn,
      disciplines: disciplinesEn,
      feedback: feedbackEn,
      formikValues: formikValuesEn,
      infopages: infopagesEn,
      institution: institutionEn,
      languages: languagesEn,
      licenses: licensesEn,
      profile: profileEn,
      publicationTypes: publicationTypesEn,
      registration: registrationEn,
      translations: translationsEn,
      workLists: workListsEn,
    },
    nob: {
      admin: adminNb,
      authorization: authorizationNb,
      common: commonNb,
      disciplines: disciplinesNb,
      feedback: feedbackNb,
      formikValues: formikValuesNb,
      infopages: infopagesNb,
      institution: institutionNb,
      languages: languagesNb,
      licenses: licensesNb,
      profile: profileNb,
      publicationTypes: publicationTypesNb,
      registration: registrationNb,
      translations: translationsNb,
      workLists: workListsNb,
    },
  },
  fallbackLng: fallbackLanguage,
  debug: false,
  ns: ['common', 'feedback', 'infopages', 'languages', 'profile', 'translations'],
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
