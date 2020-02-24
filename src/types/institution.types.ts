export interface UnitBase {
  name: string;
  id: string;
}

export interface RecursiveUnit extends UnitBase {
  subunits?: RecursiveUnit[];
}

export interface FormikUnit extends UnitBase {
  subunits: UnitBase[];
  unit: RecursiveUnit;
}

export type Unit = Pick<FormikUnit, 'name' | 'id' | 'subunits'>;

export const emptyRecursiveUnit: RecursiveUnit = {
  name: '',
  id: '',
  subunits: [],
};

export const emptyFormikUnit: FormikUnit = {
  name: '',
  id: '',
  subunits: [],
  unit: emptyRecursiveUnit,
};

export enum FormikUnitFieldNames {
  NAME = 'name',
  ID = 'id',
  SUBUNITS = 'subunits',
  UNIT = 'unit',
}

export interface UnitResponse {
  id: string;
  name: string;
  unitName: object;
  cristinUser: boolean;
  institution: object;
  uri?: string;
  acronym?: string;
  subunits: UnitResponse[];
}
