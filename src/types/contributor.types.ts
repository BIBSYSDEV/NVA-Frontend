import { BackendTypeNames, LanguageString } from './publication_types/commonRegistration.types';
import { BackendType } from './registration.types';

// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/Role.java
export enum ContributorRole {
  CREATOR = 'Creator',
  EDITOR = 'Editor',
  SUPERVISOR = 'Supervisor',
}

export interface Identity extends BackendType {
  id?: string;
  name: string;
  orcId?: string;
}

export interface Contributor extends BackendType {
  affiliations?: Institution[];
  correspondingAuthor?: boolean;
  identity: Identity;
  role: ContributorRole;
  sequence: number;
}

// DOI lookup can give labels without id for institutions,
// while when a contributor is added manually there will be ids present, and no need for labels.
export interface Institution extends BackendType {
  id?: string;
  labels?: LanguageString;
}

export const emptyContributor: Contributor = {
  affiliations: [],
  correspondingAuthor: false,
  identity: {
    name: '',
    type: BackendTypeNames.IDENTITY,
  },
  role: ContributorRole.CREATOR,
  sequence: 0,
  type: BackendTypeNames.CONTRIBUTOR,
};

interface NewContributor {
  firstName: string;
  lastName: string;
}

export const emptyNewContributor: NewContributor = {
  firstName: '',
  lastName: '',
};

export interface UnverifiedContributor {
  name: string;
  index: number;
}
