import { Registration } from '../types/registration.types';
import { PublicationType } from '../types/publicationFieldNames';

export const isJournal = (registration: Registration) =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.PUBLICATION_IN_JOURNAL;
export const isDegree = (registration: Registration) =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.DEGREE;
export const isReport = (registration: Registration) =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.REPORT;
