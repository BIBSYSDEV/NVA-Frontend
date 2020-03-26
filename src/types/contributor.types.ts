// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/Role.java
enum ContributorRole {
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
  institutions: Institution[];
  role: ContributorRole | '';

  // New model backend
  identity: {
    id: string;
    name: string;
    type: ContributorIdentityType;
  };
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
  institutions: [],
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
