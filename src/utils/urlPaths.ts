import { To } from 'react-router';
import { Registration, RegistrationStatus } from '../types/registration.types';

export interface IdentifierParams extends Record<string, string> {
  identifier: string;
}

export enum UrlPathTemplate {
  BasicData = '/basic-data',
  BasicDataAddEmployee = '/basic-data/person-register/new',
  BasicDataCentralImport = '/basic-data/central-import',
  BasicDataCentralImportCandidate = '/basic-data/central-import/:identifier',
  BasicDataCentralImportCandidateWizard = '/basic-data/central-import/:identifier/edit',
  BasicDataCentralImportCandidateMerge = '/basic-data/central-import/:candidateIdentifier/merge/:registrationIdentifier',
  BasicDataInstitutions = '/basic-data/institutions',
  BasicDataNvi = '/basic-data/nvi',
  BasicDataNviNew = '/basic-data/nvi/new',
  BasicDataPersonRegister = '/basic-data/person-register',
  Root = '/',
  Institution = '/institution',
  InstitutionCurators = '/institution/settings/curators',
  InstitutionCuratorsOverview = '/institution/overview/curators',
  InstitutionDoi = '/institution/overview/doi',
  InstitutionOverviewPage = '/institution/overview/institution',
  InstitutionSupport = '/institution/settings/support',
  InstitutionOrganizationOverview = '/institution/overview/organization',
  InstitutionOverview = '/institution/overview',
  InstitutionPortfolio = '/institution/portfolio',
  InstitutionPublishStrategy = '/institution/settings/publish-strategy',
  InstitutionPublishStrategyOverview = '/institution/overview/publish-strategy',
  InstitutionSettings = '/institution/settings',
  InstitutionVocabulary = '/institution/settings/vocabulary',
  InstitutionVocabularyOverview = '/institution/overview/vocabulary',
  InstitutionCategories = '/institution/settings/categories',
  InstitutionCategoriesOverview = '/institution/overview/categories',
  Login = '/login',
  Logout = '/logout',
  MyPage = '/my-page',
  MyPageMessages = '/my-page/messages',
  MyPageFieldAndBackground = '/my-page/profile/background',
  MyPageMyMessages = '/my-page/messages/my-messages',
  MyPageMyMessagesRegistration = '/my-page/messages/my-messages/:identifier',
  MyPageProfile = '/my-page/profile',
  MyPagePersonalia = '/my-page/profile/personalia',
  MyPageMyProjectRegistrations = '/my-page/project-registrations/my-project-registrations',
  MyPageMyProjects = '/my-page/profile/projects',
  MyPageResearchProfile = '/my-page/profile/research-profile',
  MyPageResults = '/my-page/profile/results',
  MyPageProjectRegistrations = '/my-page/project-registrations',
  MyPageRegistrations = '/my-page/registrations',
  MyPageTerms = '/my-page/profile/terms',
  MyPageMyRegistrations = '/my-page/registrations/my-registrations',
  MyPageUserRoleAndHelp = '/my-page/profile/user-role-and-help',
  PrivacyPolicy = '/privacy-policy',
  Projects = '/projects',
  ProjectsNew = '/projects/new',
  ProjectsEdit = '/project/:identifier/edit',
  RegistrationLandingPage = '/registration/:identifier',
  RegistrationNew = '/registration',
  RegistrationWizard = '/registration/:identifier/edit',
  ResearchProfile = '/research-profile',
  Reports = '/reports',
  ReportsClinicalTreatmentStudies = '/reports/clinical-treatment-studies',
  ReportsInternationalCooperation = '/reports/international-cooperation',
  ReportsNvi = '/reports/nvi',
  Search = '/search',
  SignedOut = '/signed-out',
  Tasks = '/tasks',
  TasksDialogue = '/tasks/dialogue',
  TasksDialogueRegistration = '/tasks/dialogue/:identifier',
  TasksNvi = '/tasks/nvi',
  TasksNviCandidate = '/tasks/nvi/:identifier',
  TasksNviCorrectionList = '/tasks/correction-list',
  TasksNviStatus = '/tasks/nvi/status',
  TasksResultRegistrations = '/tasks/result-registrations',
  Wildcard = '*',
}

export const getSubUrl = (path: UrlPathTemplate, basePath: UrlPathTemplate, splashRoute = false) => {
  return `${path.replace(basePath, '')}${splashRoute ? '/*' : ''}`;
};

export const getRegistrationLandingPagePath = (identifier: string) =>
  UrlPathTemplate.RegistrationLandingPage.replace(':identifier', encodeURIComponent(identifier));

export const getImportCandidatePath = (identifier: string) =>
  UrlPathTemplate.BasicDataCentralImportCandidate.replace(':identifier', encodeURIComponent(identifier));

interface RegistrationWizardPathSearch {
  tab?: number;
  doNotRedirect?: boolean;
}

export const doNotRedirectQueryParam = 'doNotRedirect';

export const getRegistrationWizardPath = (
  identifier: string,
  { tab, doNotRedirect }: RegistrationWizardPathSearch = {}
): To => {
  const searchParams = new URLSearchParams();
  if (tab !== undefined) {
    searchParams.set('tab', tab.toString());
  }
  if (doNotRedirect) {
    searchParams.set(doNotRedirectQueryParam, 'true');
  }
  return {
    pathname: UrlPathTemplate.RegistrationWizard.replace(':identifier', encodeURIComponent(identifier)),
    search: searchParams.toString(),
  };
};

export const getWizardPathByRegistration = (
  registration: Registration,
  { tab }: Pick<RegistrationWizardPathSearch, 'tab'> = {}
): To => {
  return getRegistrationWizardPath(registration.identifier, {
    tab,
    doNotRedirect: registration.status === RegistrationStatus.Unpublished && !!registration.duplicateOf,
  });
};

export const getImportCandidateWizardPath = (identifier: string) =>
  UrlPathTemplate.BasicDataCentralImportCandidateWizard.replace(':identifier', encodeURIComponent(identifier));

export const getImportCandidateMergePath = (candidateIdentifier: string, registrationIdentifier: string) =>
  UrlPathTemplate.BasicDataCentralImportCandidateMerge.replace(
    ':candidateIdentifier',
    encodeURIComponent(candidateIdentifier)
  ).replace(':registrationIdentifier', encodeURIComponent(registrationIdentifier));

export const getResearchProfilePath = (userId: string) =>
  `${UrlPathTemplate.ResearchProfile}?id=${encodeURIComponent(userId)}`;

export const getAdminInstitutionPath = (id: string) =>
  `${UrlPathTemplate.BasicDataInstitutions}?id=${encodeURIComponent(id)}`;

export const getProjectPath = (id: string) => `${UrlPathTemplate.Projects}?id=${encodeURIComponent(id)}`;

export const getEditProjectPath = (id: string) =>
  UrlPathTemplate.ProjectsEdit.replace(':identifier', encodeURIComponent(id));

export const getTasksRegistrationPath = (identifier: string) =>
  UrlPathTemplate.TasksDialogueRegistration.replace(':identifier', encodeURIComponent(identifier));

export const getMyMessagesRegistrationPath = (identifier: string) =>
  UrlPathTemplate.MyPageMyMessagesRegistration.replace(':identifier', encodeURIComponent(identifier));

export const getNviCandidatePath = (identifier: string) =>
  UrlPathTemplate.TasksNviCandidate.replace(':identifier', encodeURIComponent(identifier));
