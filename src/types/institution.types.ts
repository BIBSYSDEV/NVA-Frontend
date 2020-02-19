export interface Unit {
  name: string;
  id: string;
  subunits: Unit[]; // | []
}

export interface Subunit {
  name: string;
  id: string;
}

export interface UserUnit {
  name: string;
  id: string;
  subunits: Subunit[];
}

export interface FormikUnitState {
  name: string;
  id: string;
  subunits: Subunit[];
  unit: Unit;
}

export const emptyUnit = {
  name: '',
  id: '',
  subunits: [],
};

export const emptyFormikUnitState = {
  name: '',
  id: '',
  subunits: [],
  unit: emptyUnit,
};
