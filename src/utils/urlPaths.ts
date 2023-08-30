export interface RegistrationParams {
  identifier: string;
}

export enum UrlPathTemplate {
  About = '/about',
  BasicData = '/basic-data',
  BasicDataAddEmployee = '/basic-data/person-register/new',
  BasicDataCentralImport = '/basic-data/central-import',
  BasicDataCentralImportDuplicateCheck = '/basic-data/central-import/:identifier',
  BasicDataInstitutions = '/basic-data/institutions',
  BasicDataPersonRegister = '/basic-data/person-register',
  Editor = '/editor',
  EditorCurators = '/editor/overview/curators',
  EditorDoi = '/editor/settings/doi',
  EditorInstitution = '/editor/settings/institution',
  EditorOverview = '/editor/overview',
  EditorPublishStrategy = '/editor/settings/publish-strategy',
  EditorSettings = '/editor/settings',
  EditorVocabulary = '/editor/settings/vocabulary',
  Home = '/',
  Login = '/login',
  Logout = '/logout',
  MyPage = '/my-page',
  MyPageMessages = '/my-page/messages',
  MyPageMyMessages = '/my-page/messages/my-messages',
  MyPageMyMessagesRegistration = '/my-page/messages/my-messages/:identifier',
  MyPageMyProfile = '/my-page/my-profile',
  MyPageMyPersonalia = '/my-page/my-profile/my-personalia',
  MyPageMyProjectRegistrations = '/my-page/project-registrations/my-project-registrations',
  MyPageMyProjects = '/my-page/my-profile/my-projects',
  MyPageMyResearchProfile = '/my-page/research-profile/my-research-profile',
  MyPageMyResults = '/my-page/my-profile/my-results',
  MyPageProjectRegistrations = '/my-page/project-registrations',
  MyPageRegistrations = '/my-page/registrations',
  MyPageMyRegistrations = '/my-page/registrations/my-registrations',
  MyPageResearchProfile = '/my-page/research-profile',
  PrivacyPolicy = '/privacy-policy',
  Projects = '/projects',
  RegistrationLandingPage = '/registration/:identifier',
  RegistrationNew = '/registration',
  RegistrationWizard = '/registration/:identifier/edit',
  ResearchProfile = '/research-profile',
  Tasks = '/tasks',
  TasksDialogue = '/tasks/dialogue',
  TasksDialogueRegistration = '/tasks/dialogue/:identifier',
  TasksNvi = '/tasks/nvi',
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

export const getTasksRegistrationPath = (identifier: string) =>
  UrlPathTemplate.TasksDialogueRegistration.replace(':identifier', encodeURIComponent(identifier));

export const getMyMessagesRegistrationPath = (identifier: string) =>
  UrlPathTemplate.MyPageMyMessagesRegistration.replace(':identifier', encodeURIComponent(identifier));
