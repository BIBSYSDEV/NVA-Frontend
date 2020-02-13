export interface Contributor {
  name: string;
  institutions: Institution[];
  type: ContributorType | '';
  orcid?: string;
  corresponding?: boolean;
  email?: string;
  systemControlNumber?: string;
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
  corresponding: false,
  email: '',
  systemControlNumber: '',
};

enum ContributorType {
  AUTHOR = 'author',
  SUPERVISOR = 'supervisor',
}
