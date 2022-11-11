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
  BasicDataUsers = '/basic-data/users',
  Editor = '/editor',
  EditorAreaOfResponsibility = '/editor/area_of_responsibility',
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
  NewRegistration = '/registration',
  PrivacyPolicy = '/privacy-policy',
  Projects = '/projects',
  Registration = '/registration/:identifier?',
  RegistrationLandingPage = '/registration/:identifier/public',
  ResearchProfile = '/research-profile',
  Search = '/search',
  Wildcard = '*',
  Worklist = '/worklist',
}

export const getRegistrationLandingPagePath = (identifier: string) =>
  UrlPathTemplate.RegistrationLandingPage.replace(':identifier', encodeURIComponent(identifier));

export const getDuplicateCheckPagePath = (identifier: string) =>
  UrlPathTemplate.BasicDataCentralImportDuplicateCheck.replace(':identifier', encodeURIComponent(identifier));

export const getRegistrationPath = (identifier?: string) =>
  identifier
    ? UrlPathTemplate.Registration.replace(':identifier?', encodeURIComponent(identifier))
    : UrlPathTemplate.Registration.replace('/:identifier?', '');

export const getResearchProfilePath = (userId: string) =>
  `${UrlPathTemplate.ResearchProfile}?id=${encodeURIComponent(userId)}`;

export const getAdminInstitutionPath = (id: string) =>
  `${UrlPathTemplate.BasicDataInstitutions}?id=${encodeURIComponent(id)}`;

export const getProjectPath = (id: string) => `${UrlPathTemplate.Projects}?id=${encodeURIComponent(id)}`;
