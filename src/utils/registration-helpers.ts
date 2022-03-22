import { Registration } from '../types/registration.types';
import {
  ArtisticType,
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
import { Period } from '../types/common.types';
import { Contributor, ContributorRole } from '../types/contributor.types';
import {
  ArchitectureOutput,
  Award,
  Competition,
  Exhibition,
  MentionInPublication,
  Venue,
} from '../types/publication_types/artisticRegistration.types';

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
    : isArtistic(instanceType)
    ? PublicationType.Artistic
    : '';

export const isJournal = (instanceType: string) => Object.values(JournalType).some((type) => type === instanceType);

export const isBook = (instanceType: string) => Object.values(BookType).some((type) => type === instanceType);

export const isDegree = (instanceType: string) => Object.values(DegreeType).some((type) => type === instanceType);

export const isReport = (instanceType: string) => Object.values(ReportType).some((type) => type === instanceType);

export const isChapter = (instanceType: string) => Object.values(ChapterType).some((type) => type === instanceType);

export const isPresentation = (instanceType: string) =>
  Object.values(PresentationType).some((type) => type === instanceType);

export const isArtistic = (instanceType: string) => Object.values(ArtisticType).some((type) => type === instanceType);

export const userIsRegistrationOwner = (user: User | null, registration?: Registration) =>
  !!user && !!registration && user.isCreator && user.id === registration.resourceOwner.owner;

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

// Ensure Registration has correct type values, etc
export const getFormattedRegistration = (registration: Registration) => {
  const type = registration.entityDescription?.reference?.publicationInstance.type ?? '';
  let formattedRegistration = registration;

  if (formattedRegistration.entityDescription && !formattedRegistration.entityDescription.type) {
    formattedRegistration.entityDescription.type = 'EntityDescription';
  }
  if (formattedRegistration.entityDescription?.reference && !formattedRegistration.entityDescription.reference.type) {
    formattedRegistration.entityDescription.reference.type = 'Reference';
  }
  if (formattedRegistration.fileSet && !formattedRegistration.fileSet?.type) {
    formattedRegistration.fileSet.type = 'FileSet';
  }

  if (isPresentation(type)) {
    const presentationRegistration = formattedRegistration as PresentationRegistration;
    const { time, agent, place } = presentationRegistration.entityDescription.reference.publicationContext;

    formattedRegistration = {
      ...presentationRegistration,
      entityDescription: {
        ...presentationRegistration.entityDescription,
        reference: {
          ...presentationRegistration.entityDescription.reference,
          publicationContext: {
            ...presentationRegistration.entityDescription.reference.publicationContext,
            time: time?.from && time.to ? { ...time, type: 'Period' } : null,
            agent: agent?.name ? { ...agent, type: 'UnconfirmedOrganization' } : null,
            place: place?.label || place?.country ? { ...place, type: 'UnconfirmedPlace' } : null,
          },
        },
      },
    };
  }

  return formattedRegistration;
};

export const getNewDateValue = (date: Date | null, keyboardInput?: string, defaultMs?: number) => {
  const isValidDate = date && date && !isNaN(date.getTime());
  const isValidInput = keyboardInput?.length === 10;
  if (isValidDate) {
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, defaultMs ?? 0)
    ).toISOString();
  } else if (!isValidDate || !isValidInput) {
    return '';
  } else {
    return null;
  }
};

export const getPeriodString = (period: Period | null) => {
  const fromDate = period?.from ? new Date(period.from).toLocaleDateString() : '';
  const toDate = period?.to ? new Date(period.to).toLocaleDateString() : '';

  if (!fromDate && !toDate) {
    return '';
  } else {
    return fromDate === toDate ? fromDate : `${fromDate ?? '?'} - ${toDate ?? '?'}`;
  }
};

const mainDegreeRoles = [ContributorRole.Creator, ContributorRole.Supervisor];

export const mainContributorRolesPerType: { [type: string]: ContributorRole[] | undefined } = {
  [DegreeType.Bachelor]: mainDegreeRoles,
  [DegreeType.Master]: mainDegreeRoles,
  [DegreeType.Phd]: mainDegreeRoles,
  [DegreeType.Other]: mainDegreeRoles,
  [BookType.Anthology]: [ContributorRole.Editor],
  [ArtisticType.ArtisticDesign]: [
    ContributorRole.Designer,
    ContributorRole.CuratorOrganizer,
    ContributorRole.Consultant,
    ContributorRole.Other,
  ],
};

export const splitMainContributors = (contributors: Contributor[], registrationType: string) => {
  const mainRoles = mainContributorRolesPerType[registrationType] ?? ContributorRole.Creator;
  const mainContributors: Contributor[] = [];
  const otherContributors: Contributor[] = [];

  contributors.forEach((contributor) => {
    if (mainRoles.includes(contributor.role)) {
      mainContributors.push(contributor);
    } else {
      otherContributors.push(contributor);
    }
  });

  return [mainContributors, otherContributors];
};

export const getArtisticOutputName = (item: Venue | ArchitectureOutput) => {
  switch (item.type) {
    case 'Venue':
      return (item as Venue).place?.label ?? '';
    case 'Competition':
      return (item as Competition).name;
    case 'MentionInPublication':
      return (item as MentionInPublication).title;
    case 'Award':
      return (item as Award).name;
    case 'Exhibition':
      return (item as Exhibition).name;
    default:
      return '';
  }
};
