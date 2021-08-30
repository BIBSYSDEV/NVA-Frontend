import { Authority } from './authority.types';

export enum RoleName {
  InstitutionAdmin = 'Institution-admin',
  AppAdmin = 'App-admin',
  Curator = 'Curator',
  Creator = 'Creator',
  Editor = 'Editor',
}

export enum Affiliation {
  Employee = 'employee',
  Staff = 'staff',
  Member = 'member',
  Alum = 'alum',
  Affiliate = 'affiliate',
  Faculty = 'faculty',
  Student = 'student',
}

export interface User {
  affiliations: Affiliation[];
  authority?: Authority;
  createdDate?: string;
  cristinId?: string;
  email: string;
  name: string;
  customerId?: string;
  familyName: string;
  givenName: string;
  id: string;
  institution: string;
  isAppAdmin: boolean;
  isCurator: boolean;
  isInstitutionAdmin: boolean;
  isCreator: boolean;
  isEditor: boolean;
  lastLoginDate?: string;
  possibleAuthorities: Authority[];
  orgNumber: string;
}

interface UserRole {
  type: 'Role';
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
  sub: string;
  email_verfied: boolean;
  'custom:orgName': string;
  'custom:orgNumber': string;
  'custom:applicationRoles': string;
  identities: string;
  'custom:commonName': string;
  'custom:feideId': string;
  'custom:affiliation': string;
  'custom:customerId'?: string;
  'custom:cristinId'?: string;
  given_name: string;
  family_name: string;
}
