export interface Authority {
  name: string;
  systemControlNumber: string;
  feideIds: string[];
  orcids: string[];
  birthDate?: string;
  handle?: string;
}

export const emptyAuthority = {
  name: '',
  systemControlNumber: '',
  feideIds: [],
  orcids: [],
  birthDate: '',
  handle: '',
};
