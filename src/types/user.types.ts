export enum RoleName {
  PUBLISHER = 'Publisher',
  CURATOR = 'Curator',
}

export enum ApplicationName {
  NVA = 'NVA',
  DLR = 'DLR',
  BIRD = 'BIRD',
}

export interface Role {
  name: RoleName;
  description: string;
}

export default interface User {
  email: string;
  name: string;
  id: string;
  institution: string;
  roles: RoleName[];
  applications: ApplicationName[];
}

export const emptyUser: User = {
  name: '',
  email: '',
  id: '',
  institution: '',
  roles: [],
  applications: [],
};
