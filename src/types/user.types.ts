import { Authority, emptyAuthority } from './authority.types';

export enum RoleName {
  PUBLISHER = 'PUBLISHER',
  CURATOR = 'CURATOR',
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
}

export enum Affiliation {
  EMPLOYEE = 'employee',
  STAFF = 'staff',
  MEMBER = 'member',
  ALUM = 'alum',
  AFFILIATE = 'affiliate',
  FACULTY = 'faculty',
  STUDENT = 'student',
}

export enum ApplicationName {
  NVA = 'NVA',
  DLR = 'DLR',
  BIRD = 'BIRD',
  NONE = '',
}

export interface User {
  email: string;
  name: string;
  familyName: string;
  givenName: string;
  id: string;
  institution: string;
  roles: RoleName[];
  application: ApplicationName;
  authority: Authority;
  isLoggedIn: boolean;
  possibleAuthorities: Authority[];
  organizationId: string;
  externalOrcid: string;
  affiliations: Affiliation[];
  createdDate?: string;
  lastLoginDate?: string;
}

export type UserAdmin = Pick<
  User,
  'name' | 'id' | 'externalOrcid' | 'createdDate' | 'createdDate' | 'lastLoginDate' | 'roles'
>;

export interface FeideUser {
  name: string;
  email: string;
  'custom:identifiers': string;
  sub: string;
  email_verfied: boolean;
  'custom:orgName': string;
  'custom:orgNumber': string;
  'custom:application': string;
  'custom:applicationRoles': string;
  identities: string;
  'custom:commonName': string;
  'custom:feideId': string;
  'custom:affiliation': string;
  given_name: string;
  family_name: string;
}

export const emptyUser: User = {
  name: '',
  email: '',
  id: '',
  institution: '',
  roles: [],
  application: ApplicationName.NONE,
  authority: emptyAuthority,
  isLoggedIn: false,
  possibleAuthorities: [],
  organizationId: '',
  externalOrcid: '',
  affiliations: [],
  familyName: '',
  givenName: '',
};
