export interface Contributor {
  institutions: Institution[];
  type: ContributorType | '';
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
  institutions: [],
  type: '',
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
