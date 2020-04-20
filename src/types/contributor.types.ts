import { BackendType, BackendTypeNames } from './publication.types';

// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/Role.java
export enum ContributorRole {
  CREATOR = 'Creator',
}

interface Identity extends BackendType {
  id?: string;
  name: string;
  orcId?: string;
  arpId?: string;
}

export interface Contributor extends BackendType {
  affiliations: Institution[];
  correspondingAuthor?: boolean;
  email?: string;
  identity: Identity;
  role: ContributorRole | '';
  sequence: number;
}

interface Institution {
  id: string;
  name: string;
  institution?: Institution;
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

export interface NewContributor {
  firstName: string;
  lastName: string;
  messageToCurator?: string;
}

export const emptyNewContributor: NewContributor = {
  firstName: '',
  lastName: '',
  messageToCurator: '',
};
