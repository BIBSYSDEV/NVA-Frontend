import { LanguageString } from './common.types';

export interface Organization {
  type: 'Organization';
  id: string;
  identifier?: string;
  labels: LanguageString;
  acronym?: string;
  partOf?: Omit<Organization, 'acronym'>[];
  hasPart?: Omit<Organization, 'acronym'>[];
  country?: string;
}
