import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { LanguageCodes } from '../types/language.types';

import aboutEn from './en/about.json';
import adminEn from './en/admin.json';
import authorizationEn from './en/authorization.json';
import commonEn from './en/common.json';
import disciplinesEn from './en/disciplines.json';
import feedbackEn from './en/feedback.json';
import formikValuesEn from './en/formikValues.json';
import healthEn from './en/health.json';
import institutionEn from './en/institution.json';
import languagesEn from './en/languages.json';
import licensesEn from './en/licenses.json';
import privacyEn from './en/privacy.json';
import profileEn from './en/profile.json';
import publicationTypesEn from './en/publicationTypes.json';
import registrationEn from './en/registration.json';
import workListsEn from './en/workLists.json';

import aboutNb from './nb/about.json';
import adminNb from './nb/admin.json';
import authorizationNb from './nb/authorization.json';
import commonNb from './nb/common.json';
import disciplinesNb from './nb/disciplines.json';
import feedbackNb from './nb/feedback.json';
import formikValuesNb from './nb/formikValues.json';
import healthNb from './nb/health.json';
import institutionNb from './nb/institution.json';
import languagesNb from './nb/languages.json';
import licensesNb from './nb/licenses.json';
import privacyNb from './nb/privacy.json';
import profileNb from './nb/profile.json';
import publicationTypesNb from './nb/publicationTypes.json';
import registrationNb from './nb/registration.json';
import workListsNb from './nb/workLists.json';

export const fallbackLanguage = LanguageCodes.NORWEGIAN_BOKMAL;

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      about: aboutEn,
      admin: adminEn,
      authorization: authorizationEn,
      common: commonEn,
      disciplines: disciplinesEn,
      feedback: feedbackEn,
      formikValues: formikValuesEn,
      health: healthEn,
      institution: institutionEn,
      languages: languagesEn,
      licenses: licensesEn,
      privacy: privacyEn,
      profile: profileEn,
      publicationTypes: publicationTypesEn,
      registration: registrationEn,
      workLists: workListsEn,
    },
    nob: {
      about: aboutNb,
      admin: adminNb,
      authorization: authorizationNb,
      common: commonNb,
      disciplines: disciplinesNb,
      feedback: feedbackNb,
      formikValues: formikValuesNb,
      health: healthNb,
      institution: institutionNb,
      languages: languagesNb,
      licenses: licensesNb,
      privacy: privacyNb,
      profile: profileNb,
      publicationTypes: publicationTypesNb,
      registration: registrationNb,
      workLists: workListsNb,
    },
  },
  fallbackLng: fallbackLanguage,
  debug: false,
  ns: [
    'admin',
    'authorization',
    'common',
    'disciplines',
    'feedback',
    'formikValues',
    'health',
    'infopages',
    'institution',
    'languages',
    'licenses',
    'profile',
    'publicationTypes',
    'registration',
    'workLists',
  ],
  defaultNS: 'common',
  supportedLngs: ['nob', 'eng'],
  interpolation: {
    formatSeparator: ',',
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
