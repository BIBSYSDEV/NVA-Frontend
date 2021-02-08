import { Registration } from '../types/registration.types';
import { JournalType, PublicationType } from '../types/publicationFieldNames';
import { User } from '../types/user.types';

export const isJournal = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.PUBLICATION_IN_JOURNAL;
export const isBook = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.BOOK;
export const isDegree = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.DEGREE;
export const isReport = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.REPORT;
export const isChapter = (registration: Registration): boolean =>
  registration.entityDescription.reference.publicationContext.type === PublicationType.CHAPTER;

export const userIsRegistrationOwner = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCreator && user.id === registration.owner;

export const userIsRegistrationCurator = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCurator && user.customerId === registration.publisher.id;

export const isJournalTypeWithPeerReview = (type: string) =>
  type === JournalType.ARTICLE || type === JournalType.SHORT_COMMUNICATION;
