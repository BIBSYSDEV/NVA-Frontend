// For available roles, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/Role.java
enum ContributorRole {
  CREATOR = 'Creator',
}

export interface Contributor {
  institutions: Institution[];

  // New model backend
  corresponding?: boolean;
  email?: string;
  identity: {
    id: string;
    name: string;
  };
  sequence: number;
  role: ContributorRole | '';
}

interface Institution {
  id: string;
  name: string;
  institution?: Institution;
}

export const emptyContributor: Contributor = {
  institutions: [],

  // New model
  corresponding: false,
  email: '',
  identity: {
    id: '',
    name: '',
  },
  sequence: 0,
  role: '',
};
