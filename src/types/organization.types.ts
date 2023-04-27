import { LanguageString } from './common.types';

export interface Organization {
  type: 'Organization';
  id: string;
  labels: LanguageString;
  partOf?: Organization[];
  hasPart?: Organization[];
}
