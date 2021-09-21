import disciplines from '../resources/disciplines.json';
import { NpiDiscipline } from '../types/registration.types';

export const disciplineOptions: NpiDiscipline[] = disciplines
  .map((mainDiscipline) =>
    mainDiscipline.subdomains.map((subDiscipline) => ({
      name: subDiscipline.name,
      mainDiscipline: mainDiscipline.id,
      id: subDiscipline.id,
    }))
  )
  .flat();

export const getNpiDiscipline = (id: string): NpiDiscipline | null =>
  disciplineOptions.find((discipline) => discipline.id === id) ?? null;
