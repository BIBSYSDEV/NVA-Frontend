import { LanguageString } from './common.types';

export interface Organization {
  type: 'Organization';
  id: string;
  name: LanguageString;
  partOf?: Organization[];
  hasPart?: Organization[];
}
