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

export const emptyUnit = {
  name: '',
  id: '',
  subunits: [],
};
