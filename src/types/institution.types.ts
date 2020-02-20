export interface RecursiveUnit {
  name: string;
  id: string;
  subunits?: RecursiveUnit[];
}

export interface Subunit {
  name: string;
  id: string;
}

export interface FormikUnit {
  name: string;
  id: string;
  subunits: Subunit[];
  unit: RecursiveUnit;
}

export type Unit = Pick<FormikUnit, 'name' | 'id' | 'subunits'>;

export const emptyRecursiveUnit: RecursiveUnit = {
  name: '',
  id: '',
  subunits: [],
};

export const emptyFormikUnitState: FormikUnit = {
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
