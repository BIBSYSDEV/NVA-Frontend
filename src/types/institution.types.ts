export interface InstitutionUnitBase {
  name: string;
  id: string;
}

export interface RecursiveInstitutionUnit extends InstitutionUnitBase {
  subunits?: RecursiveInstitutionUnit[];
}

export interface FormikInstitutionUnit extends Partial<InstitutionUnitBase> {
  subunits?: InstitutionUnitBase[];
  subunit?: InstitutionUnitBase;
  unit?: RecursiveInstitutionUnit;
  editId?: string;
}

export const emptyRecursiveUnit: RecursiveInstitutionUnit = {
  name: '',
  id: '',
  subunits: [],
};

export const emptyFormikUnit: FormikInstitutionUnit = {
  subunits: [],
  unit: emptyRecursiveUnit,
};

export enum FormikInstitutionUnitFieldNames {
  SUB_UNIT = 'subunit',
  UNIT = 'unit',
  // TODO: Remove these:
  NAME = 'name',
  ID = 'id',
  SUBUNITS = 'subunits',
  EDIT_ID = 'editId',
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
