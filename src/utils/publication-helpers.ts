import { Publication } from '../types/publication.types';
import { PublicationType } from '../types/publicationFieldNames';

export const isJournal = (publication: Publication) =>
  publication.entityDescription.reference.publicationContext.type === PublicationType.PUBLICATION_IN_JOURNAL;
export const isDegree = (publication: Publication) =>
  publication.entityDescription.reference.publicationContext.type === PublicationType.DEGREE;
export const isReport = (publication: Publication) =>
  publication.entityDescription.reference.publicationContext.type === PublicationType.REPORT;
