import disciplines from '../resources/disciplines.json';
import i18n from '../translations/i18n';
import { emptyNpiDiscipline, NpiDiscipline, NpiSubdomain, NpiSubject } from '../types/publication.types';

// TODO: when we have a service for getting npiDisciplines by id this must be updated (only id is stored in backend for now)
export const getNpiDiscipline = (id: string): NpiDiscipline => {
  let npiDiscipline = emptyNpiDiscipline;
  disciplines.forEach((discipline: NpiSubject) => {
    const foundSubdomain = discipline.subdomains.find((subdomain: NpiSubdomain) => subdomain.id === id);
    if (foundSubdomain) {
      npiDiscipline = { ...foundSubdomain, mainDiscipline: discipline.subjectArea };
    }
  });

  return {
    name: i18n.t(`disciplines:${npiDiscipline.name}`),
    mainDiscipline: i18n.t(`disciplines:${npiDiscipline.mainDiscipline}`),
    id: npiDiscipline.id,
  };
};
