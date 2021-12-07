import { LanguageString } from './common.types';

export interface InstitutionUnitBase {
  acronym?: string;
  name: string;
  id: string;
}

export interface RecursiveInstitutionUnit extends InstitutionUnitBase {
  subunits?: RecursiveInstitutionUnit[];
}

export interface FormikInstitutionUnit extends Partial<RecursiveInstitutionUnit> {
  subunit?: InstitutionUnitBase;
  unit?: RecursiveInstitutionUnit;
}

export enum FormikInstitutionUnitFieldNames {
  SubUnit = 'subunit',
  Unit = 'unit',
}

export interface InstitutionState {
  items: InstitutionUnitBase[];
  language?: string;
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
