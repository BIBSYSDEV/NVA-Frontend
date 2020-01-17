import { Authority, emptyAuthority } from './authority.types';

export enum RoleName {
  PUBLISHER = 'Publisher',
  CURATOR = 'Curator',
}

export enum ApplicationName {
  NVA = 'NVA',
  DLR = 'DLR',
  BIRD = 'BIRD',
  NONE = '',
}

export interface Role {
  name: RoleName;
  description: string;
}

export interface User {
  email: string;
  name: string;
  id: string;
  institution: string;
  roles: RoleName[];
  application: ApplicationName;
  authority: Authority;
  isLoggedIn: boolean;
}

export interface FeideUser {
  name: string;
  email: string;
  'custom:identifiers': string;
  sub: string;
  email_verfied: boolean;
  'custom:orgName': string;
  'custom:orgNumber': string;
  'custom:application': string;
  'custom:applicationRoles': string;
  identities: string;
  'custom:commonName': string;
  'custom:feideId': string;
  'custom:affiliation': string;
}

export const emptyUser: User = {
  name: '',
  email: '',
  id: '',
  institution: '',
  roles: [],
  application: ApplicationName.NONE,
  authority: emptyAuthority,
  isLoggedIn: false,
};
