import { AggregationValue, LanguageString } from './common.types';
import { Keywords, KeywordsOld } from './keywords.types';

export enum RoleName {
  AppAdmin = 'App-admin',
  DoiCurator = 'Doi-Curator',
  SupportCurator = 'Support-Curator',
  PublishingCurator = 'Publishing-Curator',
  CuratorThesis = 'Curator-thesis',
  CuratorThesisEmbargo = 'Curator-thesis-embargo',
  Creator = 'Creator',
  Editor = 'Editor',
  InstitutionAdmin = 'Institution-admin',
  InternalImporter = 'Internal-importer',
  NviCurator = 'Nvi-Curator',
}

export interface User {
  nationalIdNumber: string;
  createdDate?: string;
  cristinId?: string;
  customerId?: string;
  topOrgCristinId?: string;
  familyName: string;
  givenName: string;
  feideId: string;
  isAppAdmin: boolean;
  isInternalImporter: boolean;
  isDoiCurator: boolean;
  isPublishingCurator: boolean;
  isSupportCurator: boolean;
  isThesisCurator: boolean;
  isEmbargoThesisCurator: boolean;
  isInstitutionAdmin: boolean;
  isCreator: boolean;
  isEditor: boolean;
  isNviCurator: boolean;
  roles: RoleName[];
  nvaUsername: string;
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
  institutionCristinId: string;
  roles: UserRole[];
  username: string;
  cristinId?: string;
  viewingScope: {
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

export type CristinPersonNameType = 'FirstName' | 'LastName' | 'PreferredFirstName' | 'PreferredLastName';
interface CristinPersonName extends CristinArrayValue {
  type: CristinPersonNameType;
}

interface CristinPersonContactDetails {
  telephone?: string | null;
  email?: string | null;
  webPage?: string | null;
}

export interface CreateCristinPerson {
  identifiers: CristinPersonIdentifier[];
  names: CristinPersonName[];
  employments?: Employment[];
  nvi?: NviVerification;
}

export interface CristinPerson extends CreateCristinPerson {
  id: string;
  affiliations: CristinPersonAffiliation[];
  employments: Employment[];
  contactDetails?: CristinPersonContactDetails;
  verified?: boolean;
  image?: string;
  background: {
    no?: string;
    en?: string;
  };
  keywords?: KeywordsOld[];
}

export interface PersonAggregations {
  organizationFacet: AggregationValue[];
  sectorFacet: AggregationValue[];
}

export interface FlatCristinPerson {
  firstName: string;
  lastName: string;
  preferredFirstName?: string | null;
  preferredLastName?: string | null;
  nationalId: string;
  id: string;
  cristinIdentifier: string;
  affiliations: CristinPersonAffiliation[];
  employments: Employment[];
  orcid?: string;
  background: {
    no?: string | null;
    en?: string | null;
  };
  keywords?: (Keywords | KeywordsOld)[];
  nvi?: NviVerification;
  contactDetails?: CristinPersonContactDetails;
}

interface Position {
  id: string;
  enabled: boolean;
  labels: LanguageString;
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

export const emptyEmployment: Employment = {
  type: '',
  organization: '',
  startDate: '',
  endDate: '',
  fullTimeEquivalentPercentage: '',
};

interface NviVerification {
  verifiedAt: {
    id: string;
  };
  verifiedBy: {
    id: string;
  };
}

export const emptyNviVerification: NviVerification = {
  verifiedAt: {
    id: '',
  },
  verifiedBy: {
    id: '',
  },
};

export const emptyPerson: FlatCristinPerson = {
  nationalId: '',
  firstName: '',
  lastName: '',
  id: '',
  cristinIdentifier: '',
  affiliations: [],
  employments: [],
  background: {},
  keywords: [],
  nvi: emptyNviVerification,
};
