import { BookPublicationContext } from '../../../../../../../types/publication_types/bookRegistration.types';
import {
  formatAuthorList,
  formatAuthorYearSegment,
  getCreators,
  getPersistentIdentifier,
  joinNonEmpty,
} from '../citation-helpers';
import { Formatter } from '../formatter.types';

/**
 * Formats books (AcademicMonograph, Textbook, Anthology, etc.).
 * Shape: "Authors (year). Title. Publisher. DOI"
 */
export const formatBook: Formatter = (registration, options) => {
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
