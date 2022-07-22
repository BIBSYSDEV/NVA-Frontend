import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './en.json';
import adminEn from './en/admin.json';
import authorizationEn from './en/authorization.json';
import basicDataEn from './en/basicData.json';
import commonEn from './en/common.json';
import disciplinesEn from './en/disciplines.json';
import editorEn from './en/editor.json';
import feedbackEn from './en/feedback.json';
import institutionEn from './en/institution.json';
import licensesEn from './en/licenses.json';
import myPageEn from './en/myPage.json';
import privacyEn from './en/privacy.json';
import projectEn from './en/project.json';
import publicationTypesEn from './en/publicationTypes.json';
import registrationEn from './en/registration.json';
import searchEn from './en/search.json';
import workListsEn from './en/workLists.json';

import nb from './nb.json';
import adminNb from './nb/admin.json';
import authorizationNb from './nb/authorization.json';
import basicDataNb from './nb/basicData.json';
import commonNb from './nb/common.json';
import disciplinesNb from './nb/disciplines.json';
import editorNb from './nb/editor.json';
import feedbackNb from './nb/feedback.json';
import institutionNb from './nb/institution.json';
import licensesNb from './nb/licenses.json';
import myPageNb from './nb/myPage.json';
import privacyNb from './nb/privacy.json';
import projectNb from './nb/project.json';
import publicationTypesNb from './nb/publicationTypes.json';
import registrationNb from './nb/registration.json';
import searchNb from './nb/search.json';
import workListsNb from './nb/workLists.json';

i18n.use(LanguageDetector).init({
  resources: {
    eng: {
      translations: en,
      admin: adminEn,
      authorization: authorizationEn,
      basicData: basicDataEn,
      common: commonEn,
      disciplines: disciplinesEn,
      editor: editorEn,
      feedback: feedbackEn,
      institution: institutionEn,
      licenses: licensesEn,
      myPage: myPageEn,
      privacy: privacyEn,
      project: projectEn,
      publicationTypes: publicationTypesEn,
      registration: registrationEn,
      search: searchEn,
      workLists: workListsEn,
    },
    nob: {
      translations: nb,
      admin: adminNb,
      authorization: authorizationNb,
      basicData: basicDataNb,
      common: commonNb,
      disciplines: disciplinesNb,
      editor: editorNb,
      feedback: feedbackNb,
      institution: institutionNb,
      licenses: licensesNb,
      myPage: myPageNb,
      privacy: privacyNb,
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
    'publicationTypes',
    'registration',
    'workLists',
  ],
  defaultNS: 'translations',
  supportedLngs: ['nob', 'eng'],
  interpolation: {
    formatSeparator: ',',
  },
});

export default i18n;
