import { LanguageString } from './common.types';

export enum RoleName {
  INSTITUTION_ADMIN = 'Institution-admin',
  APP_ADMIN = 'App-admin',
  CURATOR = 'Curator',
  CREATOR = 'Creator',
  EDITOR = 'Editor',
}

export interface User {
  createdDate?: string;
  cristinId?: string;
  name: string;
  customerId?: string;
  topOrgCristinId?: string;
  familyName: string;
  givenName: string;
  id: string;
  isAppAdmin: boolean;
  isCurator: boolean;
  isInstitutionAdmin: boolean;
  isCreator: boolean;
  isEditor: boolean;
  roles: RoleName[];
  viewingScope: string[];
  username: string;
  orcid?: string;
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

export interface UserList {
  type: 'UserList';
  users: InstitutionUser[];
}

export interface FeideUser {
  'custom:feideId'?: string;
  'custom:firstName'?: string;
  'custom:lastName'?: string;
  'custom:orgFeideDomain'?: string;
  'custom:cristinId'?: string;
  'custom:customerId'?: string;
  'custom:topOrgCristinId'?: string;
  'custom:nvaUsername'?: string;
  'custom:roles'?: string;
  'custom:accessRights'?: string;
  'custom:allowedCustomers'?: string;
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
  NationalIdentificationNumber?: string;
}

export interface FlatCristinUser {
  firstName: string;
  lastName: string;
  nationalId: string;
  id: string;
  cristinIdentifier: string;
  affiliations: CristinPersonAffiliation[];
}
