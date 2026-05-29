import { Contributor, ContributorRole } from '../../../../../../types/contributor.types';
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../../../../../types/publication_types/journalRegistration.types';
import { PagesRange } from '../../../../../../types/publication_types/pages.types';
import { JournalType } from '../../../../../../types/publicationFieldNames';
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

const formattersByInstanceType: Record<string, Formatter> = {
  [JournalType.AcademicArticle]: formatJournalArticle,
  [JournalType.AcademicLiteratureReview]: formatJournalArticle,
};

/**
 * Formats a registration as an APA-style citation string.
 * Dispatches on publicationInstance.type to a type-specific formatter.
 * Returns '' for types without a registered formatter.
 */
export const formatAPA = (registration: Registration, options: FormatAPAOptions = {}): string => {
  const instanceType = registration.entityDescription?.reference?.publicationInstance?.type;
  if (!instanceType) {
    return '';
  }
  const formatter = formattersByInstanceType[instanceType];
  return formatter ? formatter(registration, options) : '';
};
