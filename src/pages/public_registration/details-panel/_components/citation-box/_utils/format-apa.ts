import { Contributor, ContributorRole } from '../../../../../../types/contributor.types';
import { BookPublicationContext } from '../../../../../../types/publication_types/bookRegistration.types';
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../../../../../types/publication_types/journalRegistration.types';
import { PagesRange } from '../../../../../../types/publication_types/pages.types';
import { BookType, JournalType } from '../../../../../../types/publicationFieldNames';
import { Registration } from '../../../../../../types/registration.types';

const toInitials = (givenNames: string): string =>
  givenNames
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}.`)
    .join(' ');

const formatAuthorName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return '';
  }

  if (trimmed.includes(',')) {
    const [last, given = ''] = trimmed.split(',', 2);
    const lastName = last.trim();
    const initials = toInitials(given.trim());
    return initials ? `${lastName}, ${initials}` : lastName;
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0];
  }
  const lastName = parts[parts.length - 1];
  const initials = toInitials(parts.slice(0, -1).join(' '));
  return `${lastName}, ${initials}`;
};

const formatAuthorList = (creators: Contributor[]): string => {
  const names = [...creators]
    .sort((a, b) => a.sequence - b.sequence)
    .map((contributor) => formatAuthorName(contributor.identity.name))
    .filter(Boolean);

  if (names.length === 0) {
    return '';
  }
  if (names.length === 1) {
    return names[0];
  }
  if (names.length === 2) {
    return `${names[0]}, & ${names[1]}`;
  }
  return `${names.slice(0, -1).join(', ')}, & ${names[names.length - 1]}`;
};

const formatPages = (pages?: PagesRange | null): string => {
  if (!pages) {
    return '';
  }
  const begin = pages.begin?.trim() ?? '';
  const end = pages.end?.trim() ?? '';
  if (begin && end) {
    return `${begin}–${end}`;
  }

  return begin || end;
};

const formatAuthorYearSegment = (authors: string, year: string): string => {
  if (authors && year) return `${authors} (${year}).`;
  if (authors) return `${authors}.`;
  if (year) return `(${year}).`;
  return '';
};

const formatVolumeIssue = (volume: string, issue: string): string => {
  if (volume && issue) return `${volume}(${issue})`;
  if (volume) return volume;
  if (issue) return `(${issue})`;
  return '';
};

const formatJournalSegment = (journalTitle: string, volumeIssue: string, pages: string): string => {
  const parts = [journalTitle, volumeIssue, pages].filter(Boolean);
  return parts.length > 0 ? `${parts.join(', ')}.` : '';
};

const joinNonEmpty = (segments: string[]): string => segments.filter(Boolean).join(' ');

const getCreators = (registration: Registration): Contributor[] =>
  registration.entityDescription?.contributors?.filter(
    (contributor) => contributor.role?.type === ContributorRole.Creator
  ) ?? [];

const getPersistentIdentifier = (registration: Registration): string =>
  registration.entityDescription?.reference?.doi || registration.doi || registration.handle || '';

interface FormatAPAOptions {
  /**
   * The journal name resolved from the publication channel (SerialPublication.name).
   * publicationContext.title is only used as a fallback for unconfirmed journals.
   */
  journalName?: string;
  /**
   * The publisher name resolved from the publication channel.
   * publicationContext.publisher.name is used as a fallback for unconfirmed publishers.
   */
  publisherName?: string;
}

type Formatter = (registration: Registration, options: FormatAPAOptions) => string;

const formatJournalArticle: Formatter = (registration, options) => {
  const entityDescription = registration.entityDescription;
  const reference = entityDescription?.reference;
  const publicationContext = reference?.publicationContext as JournalPublicationContext | undefined;
  const publicationInstance = reference?.publicationInstance as JournalPublicationInstance | undefined;

  const authors = formatAuthorList(getCreators(registration));
  const year = entityDescription?.publicationDate?.year?.trim() ?? '';
  const title = entityDescription?.mainTitle?.trim() ?? '';
  const journalTitle = options.journalName?.trim() || publicationContext?.title?.trim() || '';
  const volume = publicationInstance?.volume?.trim() ?? '';
  const issue = publicationInstance?.issue?.trim() ?? '';
  const pages = formatPages(publicationInstance?.pages);
  const pid = getPersistentIdentifier(registration);

  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = title ? `${title}.` : '';
  const journalSegment = formatJournalSegment(journalTitle, formatVolumeIssue(volume, issue), pages);

  return joinNonEmpty([authorYearSegment, titleSegment, journalSegment, pid]);
};

const formatBook: Formatter = (registration, options) => {
  const entityDescription = registration.entityDescription;
  const publicationContext = entityDescription?.reference?.publicationContext as BookPublicationContext | undefined;

  const authors = formatAuthorList(getCreators(registration));
  const year = entityDescription?.publicationDate?.year?.trim() ?? '';
  const title = entityDescription?.mainTitle?.trim() ?? '';
  const publisher = options.publisherName?.trim() || publicationContext?.publisher?.name?.trim() || '';
  const pid = getPersistentIdentifier(registration);

  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = title ? `${title}.` : '';
  const publisherSegment = publisher ? `${publisher}.` : '';

  return joinNonEmpty([authorYearSegment, titleSegment, publisherSegment, pid]);
};

const formatGeneric: Formatter = (registration) => {
  const entityDescription = registration.entityDescription;
  const authors = formatAuthorList(getCreators(registration));
  const year = entityDescription?.publicationDate?.year?.trim() ?? '';
  const title = entityDescription?.mainTitle?.trim() ?? '';
  const pid = getPersistentIdentifier(registration);

  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = title ? `${title}.` : '';

  return joinNonEmpty([authorYearSegment, titleSegment, pid]);
};

const formattersByInstanceType: Record<string, Formatter> = {
  [JournalType.AcademicArticle]: formatJournalArticle,
  [JournalType.AcademicLiteratureReview]: formatJournalArticle,
  [BookType.AcademicMonograph]: formatBook,
  [BookType.AcademicCommentary]: formatBook,
  [BookType.NonFictionMonograph]: formatBook,
  [BookType.PopularScienceMonograph]: formatBook,
  [BookType.Textbook]: formatBook,
  [BookType.Encyclopedia]: formatBook,
  [BookType.ExhibitionCatalog]: formatBook,
  [BookType.Anthology]: formatBook,
};

/**
 * Formats a registration as an APA-style citation string.
 * Dispatches on publicationInstance.type to a type-specific formatter.
 * Falls back to a generic formatter (authors, year, title, DOI) for unhandled types.
 */
export const formatAPA = (registration: Registration, options: FormatAPAOptions = {}): string => {
  const instanceType = registration.entityDescription?.reference?.publicationInstance?.type;
  const formatter = (instanceType && formattersByInstanceType[instanceType]) || formatGeneric;
  return formatter(registration, options);
};
