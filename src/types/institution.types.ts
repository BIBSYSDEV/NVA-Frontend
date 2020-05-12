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
  SUB_UNIT = 'subunit',
  UNIT = 'unit',
}
