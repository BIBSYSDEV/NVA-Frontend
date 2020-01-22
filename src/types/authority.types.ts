export interface Authority {
  name: string;
  systemControlNumber: string;
  feideids: string[];
  orcids: string[];
  orgunitids: string[];
  birthDate?: string;
  handle?: string;
}

export const emptyAuthority = {
  name: '',
  systemControlNumber: '',
  feideids: [],
  orcids: [],
  orgunitids: [],
  birthDate: '',
  handle: '',
};
