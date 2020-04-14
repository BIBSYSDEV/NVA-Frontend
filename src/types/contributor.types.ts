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
  affiliations: Institution[];
  correspondingAuthor?: boolean;
  email?: string;
  identity: {
    id?: string;
    name: string;
    type: ContributorIdentityType;
    orcId?: string;
    arpId?: string;
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
  affiliations: [],
  correspondingAuthor: false,
  email: '',
  identity: {
    name: '',
    type: ContributorIdentityType.IDENTITY,
  },
  role: '',
  sequence: 0,
  type: ContributorType.CONTRIBUTOR,
};
