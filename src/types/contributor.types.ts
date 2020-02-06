export interface Contributor {
  name: string;
  institutions: Institution[];
  orcid?: string;
  corresponding?: boolean;
  email?: string;
  type: ContributorType | '';
  systemControlNumber?: string;
}

interface Institution {
  id: string;
  name: string;
  institution?: Institution;
}

const emptyContributor: Contributor = {
  name: '',
  institutions: [],
  orcid: '',
  corresponding: false,
  type: '',
  systemControlNumber: '',
};

enum ContributorType {
  AUTHOR = 'author',
  SUPERVISOR = 'supervisor',
}
