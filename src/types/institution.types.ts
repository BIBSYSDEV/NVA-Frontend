export interface Unit {
  name: string;
  id: string;
  subunits: Unit[]; // | []
}
