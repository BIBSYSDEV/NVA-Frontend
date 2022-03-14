import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import aboutEn from './en/about.json';
import adminEn from './en/admin.json';
import authorizationEn from './en/authorization.json';
import commonEn from './en/common.json';
import disciplinesEn from './en/disciplines.json';
import editorEn from './en/editor.json';
import feedbackEn from './en/feedback.json';
import institutionEn from './en/institution.json';
import licensesEn from './en/licenses.json';
import privacyEn from './en/privacy.json';
import profileEn from './en/profile.json';
import projectEn from './en/project.json';
import publicationTypesEn from './en/publicationTypes.json';
import registrationEn from './en/registration.json';
import searchEn from './en/search.json';
import workListsEn from './en/workLists.json';

import aboutNb from './nb/about.json';
import adminNb from './nb/admin.json';
import authorizationNb from './nb/authorization.json';
import commonNb from './nb/common.json';
import disciplinesNb from './nb/disciplines.json';
import editorNb from './nb/editor.json';
import feedbackNb from './nb/feedback.json';
import institutionNb from './nb/institution.json';
import licensesNb from './nb/licenses.json';
import privacyNb from './nb/privacy.json';
import profileNb from './nb/profile.json';
import projectNb from './nb/project.json';
import publicationTypesNb from './nb/publicationTypes.json';
import registrationNb from './nb/registration.json';
import searchNb from './nb/search.json';
import workListsNb from './nb/workLists.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      about: aboutEn,
      admin: adminEn,
      authorization: authorizationEn,
      common: commonEn,
      disciplines: disciplinesEn,
      editor: editorEn,
      feedback: feedbackEn,
      institution: institutionEn,
      licenses: licensesEn,
      privacy: privacyEn,
      profile: profileEn,
      project: projectEn,
      publicationTypes: publicationTypesEn,
      registration: registrationEn,
      search: searchEn,
      workLists: workListsEn,
    },
    nob: {
      about: aboutNb,
      admin: adminNb,
      authorization: authorizationNb,
      common: commonNb,
      disciplines: disciplinesNb,
      editor: editorNb,
      feedback: feedbackNb,
      institution: institutionNb,
      licenses: licensesNb,
      privacy: privacyNb,
      profile: profileNb,
      project: projectNb,
      publicationTypes: publicationTypesNb,
      registration: registrationNb,
      search: searchNb,
      workLists: workListsNb,
    },
  },
  fallbackLng: 'nob',
  debug: false,
  ns: [
    'admin',
    'authorization',
    'common',
    'disciplines',
    'feedback',
    'infopages',
    'institution',
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

export default i18n;
