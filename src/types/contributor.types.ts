export default interface ContributorType {
  id: string;
  name: string;
  institutions?: string[];
  institutionChoice?: string;
  orcid?: string;
  corresponding?: boolean;
}

export const emptyContributor =  {
  id: '',
  name: '',
  institutions: [],
  institutionChoice: '',
  orcid: '',
  corresponding: false,
}