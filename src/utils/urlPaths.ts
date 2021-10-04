import { getRegistrationIdentifier } from './registration-helpers';

export enum UrlPathTemplate {
  About = '/about',
  AdminInstitutions = '/admin-institutions',
  Home = '/',
  Login = '/login',
  Logout = '/logout',
  MyInstitution = '/my-institution',
  MyInstitutionUsers = '/my-institution-users',
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

export const getRegistrationLandingPagePath = (id: string) =>
  UrlPathTemplate.RegistrationLandingPage.replace(':identifier', encodeURIComponent(getRegistrationIdentifier(id)));

export const getRegistrationPath = (id?: string) => {
  const identifier = getRegistrationIdentifier(id ?? '');
  return identifier
    ? UrlPathTemplate.Registration.replace(':identifier?', encodeURIComponent(identifier))
    : UrlPathTemplate.Registration.replace('/:identifier?', '');
};

export const getUserPath = (authorityId: string) => `${UrlPathTemplate.User}?id=${encodeURIComponent(authorityId)}`;

export const getAdminInstitutionPath = (id: string) =>
  `${UrlPathTemplate.AdminInstitutions}?id=${encodeURIComponent(id)}`;

export const getProjectPath = (id: string) => `${UrlPathTemplate.Projects}?id=${encodeURIComponent(id)}`;
