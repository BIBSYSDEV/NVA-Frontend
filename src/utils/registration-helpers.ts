import { Registration } from '../types/registration.types';
import { PublicationType } from '../types/publicationFieldNames';

export const isJournal = (publication: Registration) =>
  publication.entityDescription.reference.publicationContext.type === PublicationType.PUBLICATION_IN_JOURNAL;
export const isDegree = (publication: Registration) =>
  publication.entityDescription.reference.publicationContext.type === PublicationType.DEGREE;
export const isReport = (publication: Registration) =>
  publication.entityDescription.reference.publicationContext.type === PublicationType.REPORT;
