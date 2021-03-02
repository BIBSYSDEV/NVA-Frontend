export enum UrlPathTemplate {
  About = '/about',
  AdminInstitutions = '/admin-institutions',
  Home = '/',
  Logout = '/logout',
  MyInstitution = '/my-institution',
  MyInstitutionUsers = '/my-institution-users',
  MyMessages = '/my-messages',
  MyProfile = '/my-profile',
  MyRegistrations = '/my-registrations',
  NewRegistration = '/registration',
  PrivacyPolicy = '/privacy-policy',
  Registration = '/registration/:identifier?',
  RegistrationLandingPage = '/registration/:identifier/public',
  Search = '/search',
  User = '/user',
  Wildcard = '*',
  Worklist = '/worklist',
}

export const getRegistrationLandingPagePath = (identifier: string) =>
  UrlPathTemplate.RegistrationLandingPage.replace(':identifier', encodeURIComponent(identifier));

export const getRegistrationPath = (identifier?: string) =>
  identifier
    ? UrlPathTemplate.Registration.replace(':identifier?', encodeURIComponent(identifier))
    : UrlPathTemplate.Registration.replace('/:identifier?', '');

export const getSearchPath = (searchTerm: string) =>
  `${UrlPathTemplate.Search}?query=${encodeURIComponent(searchTerm)}`;

export const getUserPath = (authorityId: string) => `${UrlPathTemplate.User}?id=${encodeURIComponent(authorityId)}`;

export const getAdminInstitutionPath = (id: string) =>
  `${UrlPathTemplate.AdminInstitutions}?id=${encodeURIComponent(id)}`;
