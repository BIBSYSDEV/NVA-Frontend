import { Contributor, ContributorRole } from '../../../types/contributor.types';
import { PagesRange } from '../../../types/publication_types/pages.types';
import { JournalType } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';

const supportedJournalArticleTypes: string[] = [JournalType.AcademicArticle, JournalType.AcademicLiteratureReview];

const formatAuthorName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return '';
  }

  const toInitials = (givenNames: string) =>
    givenNames
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => `${part[0].toUpperCase()}.`)
      .join(' ');

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

const joinNonEmpty = (segments: string[]): string => segments.filter(Boolean).join(' ');

interface FormatAPAOptions {
  /**
   * The journal name resolved from the publication channel (SerialPublication.name).
   * publicationContext.title is only used as a fallback for unconfirmed journals.
   */
  journalName?: string;
}

export const formatAPA = (registration: Registration, options: FormatAPAOptions = {}): string => {
  const entityDescription = registration.entityDescription;
  const reference = entityDescription?.reference;
  const instanceType = reference?.publicationInstance?.type;

  if (!instanceType || !supportedJournalArticleTypes.includes(instanceType)) {
    return '';
  }

  const publicationContext = reference?.publicationContext as { title?: string } | undefined;
  const publicationInstance = reference?.publicationInstance as
    | { volume?: string | null; issue?: string | null; pages?: PagesRange | null }
    | undefined;

  const creators =
    entityDescription?.contributors?.filter((contributor) => contributor.role?.type === ContributorRole.Creator) ?? [];
  const authors = formatAuthorList(creators);
  const year = entityDescription?.publicationDate?.year?.trim() ?? '';
  const title = entityDescription?.mainTitle?.trim() ?? '';
  const journalTitle = options.journalName?.trim() || publicationContext?.title?.trim() || '';
  const volume = publicationInstance?.volume?.trim() ?? '';
  const issue = publicationInstance?.issue?.trim() ?? '';
  const pages = formatPages(publicationInstance?.pages);
  const doi = reference?.doi || registration.doi || registration.handle || '';

  const authorYearSegment =
    authors && year ? `${authors} (${year}).` : authors ? `${authors}.` : year ? `(${year}).` : '';
  const titleSegment = title ? `${title}.` : '';

  const journalParts: string[] = [];
  if (journalTitle) {
    journalParts.push(journalTitle);
  }
  const volumeIssue = volume && issue ? `${volume}(${issue})` : volume || (issue ? `(${issue})` : '');
  if (volumeIssue) {
    journalParts.push(volumeIssue);
  }
  if (pages) {
    journalParts.push(pages);
  }
  const journalSegment = journalParts.length > 0 ? `${journalParts.join(', ')}.` : '';

  return joinNonEmpty([authorYearSegment, titleSegment, journalSegment, doi]);
};
