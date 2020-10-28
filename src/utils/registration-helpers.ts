import { Registration } from '../types/registration.types';
import { PublicationType } from '../types/publicationFieldNames';

export const isJournal = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.PUBLICATION_IN_JOURNAL;
export const isDegree = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.DEGREE;
export const isReport = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.REPORT;
