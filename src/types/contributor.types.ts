export interface Contributor {
  id: string;
  name: string;
  institution: Institution | null;
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
  institution: null,
  orcid: '',
  corresponding: false,
  type: '',
  verified: false,
};

enum ContributorType {
  AUTHOR = 'author',
  SUPERVISOR = 'supervisor',
}
