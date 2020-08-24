import { Publication } from '../types/publication.types';

export const isJournal = (publication: Publication) =>
  publication.entityDescription.reference.publicationContext.type === 'Journal';
export const isDegree = (publication: Publication) =>
  publication.entityDescription.reference.publicationContext.type === 'Degree';
export const isReport = (publication: Publication) =>
  publication.entityDescription.reference.publicationContext.type === 'Report';
