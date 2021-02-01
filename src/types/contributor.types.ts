import { BackendType } from './registration.types';
import { BackendTypeNames } from './publication_types/commonRegistration.types';

// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/Role.java
enum ContributorRole {
  CREATOR = 'Creator',
}

export interface Identity extends BackendType {
  id?: string;
  name: string;
  orcId?: string;
}

export interface Contributor extends BackendType {
  affiliations: Institution[];
  correspondingAuthor?: boolean;
  email?: string;
  identity: Identity;
  role: ContributorRole | '';
  sequence: number;
}

export interface Labels {
  [key: string]: string;
}

// DOI lookup can give labels without id for institutions, while user will add IDs.
export interface Institution extends BackendType {
  id?: string;
  labels?: Labels;
}

export const emptyContributor: Contributor = {
  affiliations: [],
  correspondingAuthor: false,
  email: '',
  identity: {
    name: '',
    type: BackendTypeNames.IDENTITY,
  },
  role: '',
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
