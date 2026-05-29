import { ChapterPublicationInstance } from '../../../../../../../types/publication_types/chapterRegistration.types';
import {
  formatAuthorList,
  formatAuthorYearSegment,
  formatPages,
  getCreators,
  getPersistentIdentifier,
  joinNonEmpty,
} from '../citation-helpers';
import { Formatter } from '../formatter.types';

const formatChapterContainerSegment = (editors: string, bookTitle: string, pages: string): string => {
  // The "In ..." segment is anchored on the parent book title; without it the editor/pages are meaningless.
  if (!bookTitle) return '';
  const editorPart = editors ? `${editors} (Ed.), ` : '';
  const pagesPart = pages ? ` (pp. ${pages})` : '';
  return `In ${editorPart}${bookTitle}${pagesPart}.`;
};

/**
 * Formats book chapters (AcademicChapter, Introduction, etc.).
 * Shape: "Authors (year). Chapter title. In R. Editor (Ed.), Book title (pp. xx–xx). Publisher. DOI"
 * The editor / book title / publisher come from the parent book and must be supplied via options.
 */
export const formatChapter: Formatter = (registration, options) => {
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
