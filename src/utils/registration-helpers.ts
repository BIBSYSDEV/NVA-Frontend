import { Registration } from '../types/registration.types';
import {
  BookType,
  ChapterType,
  DegreeType,
  JournalType,
  PublicationType,
  ReportType,
} from '../types/publicationFieldNames';
import { User } from '../types/user.types';

export const getMainRegistrationType = (registration: Registration) =>
  isJournal(registration)
    ? PublicationType.PublicationInJournal
    : isBook(registration)
    ? PublicationType.Book
    : isDegree(registration)
    ? PublicationType.Degree
    : isReport(registration)
    ? PublicationType.Report
    : isChapter(registration)
    ? PublicationType.Chapter
    : '';

export const isJournal = (registration: Registration) =>
  Object.values(JournalType).some((type) => type === registration.entityDescription.reference.publicationInstance.type);

export const isBook = (registration: Registration) =>
  Object.values(BookType).some((type) => type === registration.entityDescription.reference.publicationInstance.type);

export const isDegree = (registration: Registration) =>
  Object.values(DegreeType).some((type) => type === registration.entityDescription.reference.publicationInstance.type);

export const isReport = (registration: Registration) =>
  Object.values(ReportType).some((type) => type === registration.entityDescription.reference.publicationInstance.type);

export const isChapter = (registration: Registration) =>
  Object.values(ChapterType).some((type) => type === registration.entityDescription.reference.publicationInstance.type);

export const userIsRegistrationOwner = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCreator && user.id === registration.owner;

export const userIsRegistrationCurator = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCurator && user.customerId === registration.publisher.id;

export const getYearQuery = (yearValue: string) =>
  yearValue && Number.isInteger(Number(yearValue)) ? yearValue : new Date().getFullYear();
