export interface RegistrationParams {
  identifier: string;
}

export enum UrlPathTemplate {
  About = '/about',
  BasicData = '/basic-data',
  BasicDataAddEmployee = '/basic-data/add-employee',
  BasicDataCentralImport = '/basic-data/central-import',
  BasicDataCentralImportDuplicateCheck = '/basic-data/central-import-duplicate-check/:identifier',
  BasicDataInstitutions = '/basic-data/institutions',
  BasicDataPersonRegister = '/basic-data/person-register',
  Editor = '/editor',
  EditorCurators = '/editor/curators',
  EditorDoi = '/editor/doi',
  EditorInstitution = '/editor/institution',
  EditorPublishStrategy = '/editor/publish-strategy',
  EditorVocabulary = '/editor/vocabulary',
  Home = '/',
  Login = '/login',
  Logout = '/logout',
  MyPage = '/my-page',
  MyPageMessages = '/my-page/messages',
  MyPageMyProfile = '/my-page/my-profile',
  MyPageRegistrations = '/my-page/registrations',
  MyPageResearchProfile = '/my-page/research-profile',
  PrivacyPolicy = '/privacy-policy',
  Projects = '/projects',
  RegistrationLandingPage = '/registration/:identifier',
  RegistrationNew = '/registration',
  RegistrationWizard = '/registration/:identifier/edit',
  ResearchProfile = '/research-profile',
  Search = '/search',
  Tasks = '/tasks',
  Wildcard = '*',
}

export const getRegistrationLandingPagePath = (identifier: string) =>
  UrlPathTemplate.RegistrationLandingPage.replace(':identifier', encodeURIComponent(identifier));

export const getDuplicateCheckPagePath = (identifier: string) =>
  UrlPathTemplate.BasicDataCentralImportDuplicateCheck.replace(':identifier', encodeURIComponent(identifier));

export const getRegistrationWizardPath = (identifier: string) =>
  UrlPathTemplate.RegistrationWizard.replace(':identifier', encodeURIComponent(identifier));

export const getResearchProfilePath = (userId: string) =>
  `${UrlPathTemplate.ResearchProfile}?id=${encodeURIComponent(userId)}`;

export const getAdminInstitutionPath = (id: string) =>
  `${UrlPathTemplate.BasicDataInstitutions}?id=${encodeURIComponent(id)}`;

export const getProjectPath = (id: string) => `${UrlPathTemplate.Projects}?id=${encodeURIComponent(id)}`;
