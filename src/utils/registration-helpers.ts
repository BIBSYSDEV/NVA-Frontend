import { Registration } from '../types/registration.types';
import {
  BookType,
  ChapterType,
  DegreeType,
  JournalType,
  PresentationType,
  PublicationType,
  ReportType,
} from '../types/publicationFieldNames';
import { User } from '../types/user.types';
import i18n from '../translations/i18n';
import { PresentationRegistration } from '../types/publication_types/presentationRegistration.types';

export const getMainRegistrationType = (instanceType: string) =>
  isJournal(instanceType)
    ? PublicationType.PublicationInJournal
    : isBook(instanceType)
    ? PublicationType.Book
    : isDegree(instanceType)
    ? PublicationType.Degree
    : isReport(instanceType)
    ? PublicationType.Report
    : isChapter(instanceType)
    ? PublicationType.Chapter
    : isPresentation(instanceType)
    ? PublicationType.Presentation
    : '';

export const isJournal = (instanceType: string) => Object.values(JournalType).some((type) => type === instanceType);

export const isBook = (instanceType: string) => Object.values(BookType).some((type) => type === instanceType);

export const isDegree = (instanceType: string) => Object.values(DegreeType).some((type) => type === instanceType);

export const isReport = (instanceType: string) => Object.values(ReportType).some((type) => type === instanceType);

export const isChapter = (instanceType: string) => Object.values(ChapterType).some((type) => type === instanceType);

export const isPresentation = (instanceType: string) =>
  Object.values(PresentationType).some((type) => type === instanceType);

export const userIsRegistrationOwner = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCreator && user.id === registration.owner;

export const userIsRegistrationCurator = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCurator && user.customerId === registration.publisher.id;

export const getYearQuery = (yearValue: string) =>
  yearValue && Number.isInteger(Number(yearValue)) ? yearValue : new Date().getFullYear();

const getPublicationChannelIssnString = (onlineIssn?: string | null, printIssn?: string | null) => {
  const issnString =
    printIssn || onlineIssn
      ? [
          printIssn ? `${i18n.t('registration:resource_type.print_issn')}: ${printIssn}` : '',
          onlineIssn ? `${i18n.t('registration:resource_type.online_issn')}: ${onlineIssn}` : '',
        ]
          .filter((issn) => issn)
          .join(', ')
      : '';
  return issnString;
};

export const getPublicationChannelString = (title: string, onlineIssn?: string | null, printIssn?: string | null) => {
  const issnString = getPublicationChannelIssnString(onlineIssn, printIssn);
  return issnString ? `${title} (${issnString})` : title;
};

export const getRegistrationIdentifier = (id: string) => id.split('/').pop() ?? '';

export const getFormattedRegistration = (registration: Registration) => {
  const type = registration.entityDescription?.reference?.publicationInstance.type ?? '';
  let formattedValues = registration;

  if (isPresentation(type)) {
    const presentationRegistration = registration as PresentationRegistration;
    const { time } = presentationRegistration.entityDescription.reference.publicationContext;

    formattedValues = {
      ...presentationRegistration,
      entityDescription: {
        ...presentationRegistration.entityDescription,
        reference: {
          ...presentationRegistration.entityDescription.reference,
          publicationContext: {
            ...presentationRegistration.entityDescription.reference.publicationContext,
            time: time?.from && time.to ? { ...time, type: 'Period' } : null,
          },
        },
      },
    };
  }

  return formattedValues;
};
