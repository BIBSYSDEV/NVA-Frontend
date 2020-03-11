export interface Contributor {
  name: string;
  institutions: Institution[];
  type: ContributorType | '';
  orcid?: string;
  systemControlNumber?: string;

  // New model backend
  corresponding?: boolean;
  email?: string;
  identity: {
    name: string;
  };
  sequence: number;
}

interface Institution {
  id: string;
  name: string;
  institution?: Institution;
}

export const emptyContributor: Contributor = {
  name: '',
  institutions: [],
  type: '',
  orcid: '',
  systemControlNumber: '',

  // New model
  corresponding: false,
  email: '',
  identity: {
    name: '',
  },
  sequence: 0,
};

enum ContributorType {
  AUTHOR = 'author',
  SUPERVISOR = 'supervisor',
}
