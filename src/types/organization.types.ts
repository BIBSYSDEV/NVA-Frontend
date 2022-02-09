import { LanguageString } from './common.types';

export interface Organization {
  id: string;
  name: LanguageString;
  partOf?: Organization[];
  hasPart?: Organization[];
}

export interface OrganizationSearch {
  size: number;
  hits: Organization[];
}
