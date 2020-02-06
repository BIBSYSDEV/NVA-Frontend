export interface Contributor {
  id: string;
  name: string;
  institutions: Institution[];
  orcid?: string;
  corresponding?: boolean;
  email?: string;
  type: ContributorType | '';
  verified?: boolean;
}

interface Institution {
  id: string;
  name: string;
  institution?: Institution;
}

const emptyContributor: Contributor = {
  id: '',
  name: '',
  institutions: [],
  orcid: '',
  corresponding: false,
  type: '',
  verified: false,
};

enum ContributorType {
  AUTHOR = 'author',
  SUPERVISOR = 'supervisor',
}
