import { LanguageString } from './common.types';

interface InstitutionUnitBase {
  acronym?: string;
  name: string;
  id: string;
}

export interface RecursiveInstitutionUnit extends InstitutionUnitBase {
  subunits?: RecursiveInstitutionUnit[];
}

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
