export interface Authority {
  name: string;
  systemControlNumber: string;
  feideids: string[];
  orcids: string[];
  birthDate?: string;
  handles: string[];
}

export const emptyAuthority = {
  name: '',
  systemControlNumber: '',
  feideids: [],
  orcids: [],
  birthDate: '',
  handles: [],
};
