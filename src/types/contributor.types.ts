export enum Direction {
  ARROW_UP = -1,
  ARROW_DOWN = 1,
}

export default interface ContributorType {
  id: string;
  name: string;
  institutions?: string[];
  selectedInstitution?: string;
  orcid?: string;
  corresponding?: boolean;
  type: string;
  verified: boolean;
}

export const emptyContributor: ContributorType = {
  id: '',
  name: '',
  institutions: [],
  selectedInstitution: '',
  orcid: '',
  corresponding: false,
  type: '',
  verified: false,
};
