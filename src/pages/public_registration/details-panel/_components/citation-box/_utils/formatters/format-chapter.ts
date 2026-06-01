import { Registration } from '../../../../../../../types/registration.types';
import { ChapterPublicationInstance } from '../../../../../../../types/publication_types/chapterRegistration.types';
import { formatAuthorYearSegment, formatPages, joinNonEmpty, normalizeBaseFields } from '../citation-helpers';
import { FormatAPAOptions, Formatter } from '../formatter.types';

const formatChapterContainerSegment = (editors: string, bookTitle: string, pages: string): string => {
  // The "In ..." segment is anchored on the parent book title; without it the editor/pages are meaningless.
  // The editors string is expected to already include the "(Ed.)" / "(Eds.)" suffix (added by formatAuthorList).
  if (!bookTitle) return '';
  const editorPart = editors ? `${editors}, ` : '';
  const pagesPart = pages ? ` (pp. ${pages})` : '';
  return `In ${editorPart}${bookTitle}${pagesPart}.`;
};

const normalizeChapterFields = (registration: Registration, options: FormatAPAOptions) => {
  const publicationInstance = registration.entityDescription?.reference?.publicationInstance as
    | ChapterPublicationInstance
    | undefined;
  return {
    ...normalizeBaseFields(registration),
    editors: options.editors?.trim() ?? '',
    bookTitle: options.bookTitle?.trim() ?? '',
    publisher: options.publisherName?.trim() ?? '',
    pages: formatPages(publicationInstance?.pages),
  };
};

/**
 * Formats book chapters (AcademicChapter, Introduction, etc.).
 * Shape: "Authors (year). Chapter title. In R. Editor (Ed.), Book title (pp. xx–xx). Publisher. DOI"
 * The editor / book title / publisher come from the parent book and must be supplied via options.
 */
export const formatChapter: Formatter = (registration, options) => {
  const { authors, year, title, editors, bookTitle, publisher, pages, pid } = normalizeChapterFields(
    registration,
    options
  );
  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = title ? `${title}.` : '';
  const containerSegment = formatChapterContainerSegment(editors, bookTitle, pages);
  const publisherSegment = publisher ? `${publisher}.` : '';
  return joinNonEmpty([authorYearSegment, titleSegment, containerSegment, publisherSegment, pid]);
};
