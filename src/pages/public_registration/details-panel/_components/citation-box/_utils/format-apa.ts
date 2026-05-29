import { BookPublicationContext } from '../../../../../../types/publication_types/bookRegistration.types';
import { ChapterPublicationInstance } from '../../../../../../types/publication_types/chapterRegistration.types';
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../../../../../types/publication_types/journalRegistration.types';
import { ReportPublicationContext } from '../../../../../../types/publication_types/reportRegistration.types';
import { BookType, ChapterType, JournalType, ReportType } from '../../../../../../types/publicationFieldNames';
import { Registration } from '../../../../../../types/registration.types';
import {
  formatAuthorList,
  formatAuthorYearSegment,
  formatPages,
  getCreators,
  getPersistentIdentifier,
  joinNonEmpty,
} from './citation-helpers';
import { FormatAPAOptions, Formatter } from './formatter.types';

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

const formatReport: Formatter = (registration, options) => {
  const entityDescription = registration.entityDescription;
  const publicationContext = entityDescription?.reference?.publicationContext as ReportPublicationContext | undefined;

  const authors = formatAuthorList(getCreators(registration));
  const year = entityDescription?.publicationDate?.year?.trim() ?? '';
  const title = entityDescription?.mainTitle?.trim() ?? '';
  const reportNumber = publicationContext?.seriesNumber?.trim() ?? '';
  const institution = options.publisherName?.trim() || publicationContext?.publisher?.name?.trim() || '';
  const pid = getPersistentIdentifier(registration);

  const titleText = title && reportNumber ? `${title} (Report No. ${reportNumber})` : title;

  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = titleText ? `${titleText}.` : '';
  const institutionSegment = institution ? `${institution}.` : '';

  return joinNonEmpty([authorYearSegment, titleSegment, institutionSegment, pid]);
};

const formatChapterContainerSegment = (editors: string, bookTitle: string, pages: string): string => {
  // The "In ..." segment is anchored on the parent book title; without it the editor/pages are meaningless.
  if (!bookTitle) return '';
  const editorPart = editors ? `${editors} (Ed.), ` : '';
  const pagesPart = pages ? ` (pp. ${pages})` : '';
  return `In ${editorPart}${bookTitle}${pagesPart}.`;
};

const formatChapter: Formatter = (registration, options) => {
  const entityDescription = registration.entityDescription;
  const publicationInstance = entityDescription?.reference?.publicationInstance as
    | ChapterPublicationInstance
    | undefined;

  const authors = formatAuthorList(getCreators(registration));
  const year = entityDescription?.publicationDate?.year?.trim() ?? '';
  const chapterTitle = entityDescription?.mainTitle?.trim() ?? '';
  const editors = options.editors?.trim() ?? '';
  const bookTitle = options.bookTitle?.trim() ?? '';
  const publisher = options.publisherName?.trim() ?? '';
  const pages = formatPages(publicationInstance?.pages);
  const pid = getPersistentIdentifier(registration);

  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const chapterTitleSegment = chapterTitle ? `${chapterTitle}.` : '';
  const containerSegment = formatChapterContainerSegment(editors, bookTitle, pages);
  const publisherSegment = publisher ? `${publisher}.` : '';

  return joinNonEmpty([authorYearSegment, chapterTitleSegment, containerSegment, publisherSegment, pid]);
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
  [ReportType.Research]: formatReport,
  [ReportType.Policy]: formatReport,
  [ReportType.WorkingPaper]: formatReport,
  [ReportType.BookOfAbstracts]: formatReport,
  [ReportType.ConferenceReport]: formatReport,
  [ReportType.Report]: formatReport,
  [ChapterType.AcademicChapter]: formatChapter,
  [ChapterType.NonFictionChapter]: formatChapter,
  [ChapterType.PopularScienceChapter]: formatChapter,
  [ChapterType.TextbookChapter]: formatChapter,
  [ChapterType.EncyclopediaChapter]: formatChapter,
  [ChapterType.Introduction]: formatChapter,
  [ChapterType.ExhibitionCatalogChapter]: formatChapter,
  [ChapterType.ReportChapter]: formatChapter,
  [ChapterType.ConferenceAbstract]: formatChapter,
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
