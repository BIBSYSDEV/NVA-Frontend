export interface Authority {
  name: string;
  scn: string;
  feideId: string[];
  orcid: string[];
  birthDate?: string;
  handle: string;
}

export const emptyAuthority = {
  name: '',
  scn: '',
  feideId: [],
  orcid: [],
  birthDate: '',
  handle: '',
};
