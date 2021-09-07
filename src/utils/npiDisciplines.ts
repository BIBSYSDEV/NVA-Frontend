import disciplines from '../resources/disciplines.json';
import i18n from '../translations/i18n';
import { NpiDiscipline } from '../types/registration.types';

export const disciplineOptions: NpiDiscipline[] = disciplines
  .map((mainDiscipline) =>
    mainDiscipline.subdomains.map((subDiscipline) => ({
      name: i18n.t(`disciplines:${subDiscipline.name}`),
      mainDiscipline: i18n.t(`disciplines:${mainDiscipline.subjectArea}`),
      id: subDiscipline.id,
    }))
  )
  .flat();

export const getNpiDiscipline = (id: string): NpiDiscipline | null =>
  disciplineOptions.find((discipline) => discipline.id === id) ?? null;
