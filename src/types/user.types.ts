import { Authority } from './authority.types';
import { LanguageString } from './common.types';

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
  roles: RoleName[];
  orgNumber: string;
  viewingScope: string[];
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
  viewingScope?: {
    type: 'ViewingScope';
    includedUnits: string[];
  };
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

export interface CristinPersonAffiliation {
  active: boolean;
  organization: string;
  role: {
    labels: LanguageString;
  };
}

export interface CristinArrayValue {
  type: string;
  value: string;
}

export type CristinPersonIdentifierType = 'CristinIdentifier' | 'NationalIdentificationNumber' | 'ORCID';
export interface CristinPersonIdentifier extends CristinArrayValue {
  type: CristinPersonIdentifierType;
}

export type CristinPersonNameType = 'FirstName' | 'LastName';
interface CristinPersonName extends CristinArrayValue {
  type: CristinPersonNameType;
}

export interface CreateCristinUser {
  identifiers: CristinPersonIdentifier[];
  names: CristinPersonName[];
}

export interface CristinUser extends CreateCristinUser {
  id: string;
  affiliations: CristinPersonAffiliation[];
}

export interface FlatCristinUser {
  firstName: string;
  lastName: string;
  nationalId: string;
}
