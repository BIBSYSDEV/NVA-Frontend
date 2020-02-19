export interface Unit {
  name: string;
  id: string;
  subunits: Unit[]; // | []
}

export const emptyUnit = {
  name: '',
  id: '',
  subunits: [],
};
