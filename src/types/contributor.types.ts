export enum Direction {
  ARROW_UP = -1,
  ARROW_DOWN = 1,
}

export default interface Contributor {
  id: string;
  name: string;
  institution: Institution | null;
  orcid?: string;
  corresponding?: boolean;
  email?: string;
  type: ContributorType | '';
  verified?: boolean;
}

export interface Institution {
  id: string;
  name: string;
  institution?: Institution;
}

export const emptyContributor: Contributor = {
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
