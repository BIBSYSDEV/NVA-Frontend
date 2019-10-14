export enum RoleName {
  PUBLISHER = 'Publisher',
  CURATOR = 'Curator',
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
}

export const emptyUser: User = {
  name: '',
  email: '',
  id: '',
  institution: '',
  roles: [],
};
