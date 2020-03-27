// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/Role.java
export enum ContributorRole {
  CREATOR = 'Creator',
}

enum ContributorType {
  CONTRIBUTOR = 'Contributor',
}

enum ContributorIdentityType {
  IDENTITY = 'Identity',
}

export interface Contributor {
  corresponding?: boolean;
  email?: string;

  // New model backend
  affiliations: Institution[];
  identity: {
    id: string;
    name: string;
    type: ContributorIdentityType;
  };
  role: ContributorRole | '';
  sequence: number;
  type: ContributorType;
}

interface Institution {
  id: string;
  name: string;
  institution?: Institution;
}

export const emptyContributor: Contributor = {
  corresponding: false,
  email: '',
  affiliations: [],
  role: '',

  // New model
  identity: {
    id: '',
    name: '',
    type: ContributorIdentityType.IDENTITY,
  },
  sequence: 0,
  type: ContributorType.CONTRIBUTOR,
};
