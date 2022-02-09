import { LanguageString } from './common.types';

export enum FormikInstitutionUnitFieldNames {
  SubUnit = 'subunit',
  Unit = 'unit',
}

export interface Organization {
  id: string;
  name: LanguageString;
  partOf?: Organization[];
  hasPart?: Organization[];
}

export interface OrganizationsResponse {
  hits: Organization[];
}
