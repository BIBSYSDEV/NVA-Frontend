import { Registration } from '../types/registration.types';
import { PublicationType } from '../types/publicationFieldNames';
import { User } from '../types/user.types';

export const isJournal = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.PublicationInJournal;
export const isBook = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.Book;
export const isDegree = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.Degree;
export const isReport = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.Report;
export const isChapter = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.Chapter;

export const userIsRegistrationOwner = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCreator && user.id === registration.owner;

export const userIsRegistrationCurator = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCurator && user.customerId === registration.publisher.id;

export const getYearQuery = (yearValue: string) =>
  yearValue && Number.isInteger(Number(yearValue)) ? yearValue : new Date().getFullYear();
