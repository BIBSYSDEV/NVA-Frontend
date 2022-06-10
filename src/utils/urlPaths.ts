export enum UrlPathTemplate {
  About = '/about',
  BasicData = '/basic-data',
  BasicDataAddEmployee = '/basic-data/add-employee',
  BasicDataCentralImport = '/basic-data/central-import',
  BasicDataCentralImportDuplicateCheck = '/basic-data/central-import-duplicate-check/:identifier',
  BasicDataInstitutions = '/basic-data/institutions',
  BasicDataMyInstitution = '/basic-data/my-institution',
  BasicDataPersonRegister = '/basic-data/person-register',
  BasicDataUsers = '/basic-data/users',
  Editor = '/editor',
  EditorPublishStrategy = '/editor/publish-strategy',
  EditorVocabulary = '/editor/vocabulary',
  Home = '/',
  Login = '/login',
  Logout = '/logout',
  MyMessages = '/my-messages',
  MyProfile = '/my-profile',
  MyRegistrations = '/my-registrations',
  NewRegistration = '/registration',
  PrivacyPolicy = '/privacy-policy',
  Projects = '/projects',
  Registration = '/registration/:identifier?',
  RegistrationLandingPage = '/registration/:identifier/public',
  Search = '/search',
  User = '/user',
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

export const getUserPath = (userId: string) => `${UrlPathTemplate.User}?id=${encodeURIComponent(userId)}`;

export const getAdminInstitutionPath = (id: string) =>
  `${UrlPathTemplate.BasicDataInstitutions}?id=${encodeURIComponent(id)}`;

export const getProjectPath = (id: string) => `${UrlPathTemplate.Projects}?id=${encodeURIComponent(id)}`;
