export enum Direction {
  ARROW_UP = -1,
  ARROW_DOWN = 1,
}

// export default interface ContributorType {
//   id: string;
//   name: string;
//   institutions?: string[];
//   selectedInstitution?: string;
//   orcid?: string;
//   corresponding?: boolean;
//   type?: string;
//   verified?: boolean;
// }

// export const emptyContributor: ContributorType = {
//   id: '',
//   name: '',
//   institutions: [],
//   selectedInstitution: '',
//   orcid: '',
//   corresponding: false,
//   type: '',
//   verified: false,
// };

// TODO: The following will currently mess up contributors-form :/
export default interface Contributor {
  id: string;
  name: string;
  institution?: Institution;
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
  institution: undefined,
  orcid: '',
  corresponding: false,
  type: '',
  verified: false,
};

enum ContributorType {
  AUTHOR = 'author',
  SUPERVISOR = 'supervisor',
}
