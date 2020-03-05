export interface InstitutionUnitBase {
  name: string;
  id: string;
}

export interface RecursiveInstitutionUnit extends InstitutionUnitBase {
  subunits?: RecursiveInstitutionUnit[];
}

export interface FormikInstitutionUnit extends InstitutionUnitBase {
  subunits: InstitutionUnitBase[];
  unit: RecursiveInstitutionUnit;
}

export const emptyRecursiveUnit: RecursiveInstitutionUnit = {
  name: '',
  id: '',
  subunits: [],
};

export const emptyFormikUnit: FormikInstitutionUnit = {
  name: '',
  id: '',
  subunits: [],
  unit: emptyRecursiveUnit,
};

export enum FormikInstitutionUnitFieldNames {
  NAME = 'name',
  ID = 'id',
  SUBUNITS = 'subunits',
  UNIT = 'unit',
}

export interface InstitutionUnitResponseType {
  id: string;
  name: string;
  unitName: object;
  cristinUser: boolean;
  institution: object;
  uri: string;
  acronym: string;
  subunits: InstitutionUnitResponseType[];
}
