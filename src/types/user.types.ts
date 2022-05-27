import { LanguageString } from './common.types';

export enum RoleName {
  InstitutionAdmin = 'Institution-admin',
  AppAdmin = 'App-admin',
  Curator = 'Curator',
  Creator = 'Creator',
  Editor = 'Editor',
}

export interface User {
  nationalIdNumber: string;
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
  allowedCustomers: string[];
}

export interface UserRole {
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
  'custom:feideIdNin'?: string;
  'custom:nin'?: string;
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
  orcid?: string;
}

interface Position {
  id: string;
  enabled: boolean;
  name: LanguageString;
}

export interface PositionResponse {
  positions: Position[];
}

export interface Employment {
  type: string;
  organization: string;
  startDate: string;
  endDate: string;
  fullTimeEquivalentPercentage: string;
}
