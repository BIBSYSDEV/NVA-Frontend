import { Authority } from './authority.types';

export enum RoleName {
  INSTITUTION_ADMIN = 'Institution-admin',
  APP_ADMIN = 'App-admin',
  CURATOR = 'Curator',
  CREATOR = 'Creator',
  EDITOR = 'Editor',
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
  affiliations: Affiliation[];
  application: ApplicationName;
  authority: Authority | null;
  createdDate?: string;
  cristinId?: string;
  email: string;
  externalOrcid: string;
  name: string;
  customerId: string;
  familyName: string;
  givenName: string;
  id: string;
  institution: string;
  isAppAdmin: boolean;
  isCurator: boolean;
  isInstitutionAdmin: boolean;
  isCreator: boolean;
  lastLoginDate?: string;
  possibleAuthorities: Authority[];
  roles: RoleName[];
}

export interface UserRole {
  rolename: RoleName;
}

export interface InstitutionUser {
  familyName?: string;
  givenName?: string;
  institution: string;
  roles: UserRole[];
  username: string;
}

export interface FeideUser {
  name: string;
  email: string;
  cristinId?: string;
  'custom:identifiers': string;
  sub: string;
  email_verfied: boolean;
  'custom:orgName': string;
  'custom:application': string;
  'custom:applicationRoles': string;
  identities: string;
  'custom:commonName': string;
  'custom:feideId': string;
  'custom:affiliation': string;
  'custom:customerId': string;
  'custom:cristinId': string;
  given_name: string;
  family_name: string;
}
