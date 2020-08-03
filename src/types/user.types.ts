import { Authority } from './authority.types';

export enum RoleName {
  INSTITUTION_ADMIN = 'Institution-admin',
  APP_ADMIN = 'App-admin',
  CURATOR = 'Curator',
  PUBLISHER = 'Publisher',
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
  authority: Authority | null;
  possibleAuthorities: Authority[];
  organizationId: string;
  externalOrcid: string;
  affiliations: Affiliation[];
  createdDate?: string;
  lastLoginDate?: string;
  isAppAdmin: boolean;
  isCurator: boolean;
  isPublisher: boolean;
  isInstitutionAdmin: boolean;
}

export interface UserRole {
  rolename: RoleName;
}

export interface InstitutionUser {
  institution: string;
  roles: UserRole[];
  username: string;
}

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
