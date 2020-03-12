export interface Contributor {
  institutions: Institution[];
  type: ContributorType | '';

  // New model backend
  corresponding?: boolean;
  email?: string;
  identity: {
    id: string;
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

  // New model
  corresponding: false,
  email: '',
  identity: {
    id: '',
    name: '',
  },
  sequence: 0,
};

enum ContributorType {
  AUTHOR = 'author',
  SUPERVISOR = 'supervisor',
}
