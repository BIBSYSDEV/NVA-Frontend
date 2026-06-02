import { Registration } from '../../../../../../../types/registration.types';
import { BookPublicationContext } from '../../../../../../../types/publication_types/bookRegistration.types';
import { formatAuthorYearSegment, joinNonEmpty, normalizeBaseFields } from '../citation-helpers';
import { FormatAPAOptions, Formatter } from '../formatter.types';

const normalizeBookFields = (registration: Registration, options: FormatAPAOptions) => {
  const publicationContext = registration.entityDescription?.reference?.publicationContext as
    | BookPublicationContext
    | undefined;
  return {
    ...normalizeBaseFields(registration),
    publisher: options.publisherName?.trim() || publicationContext?.publisher?.name?.trim() || '',
  };
};

/**
 * Formats books (AcademicMonograph, Textbook, Anthology, etc.).
 * Shape: "Authors (year). Title. Publisher. DOI"
 */
export const formatBook: Formatter = (registration, options) => {
  const { authors, year, title, publisher, pid } = normalizeBookFields(registration, options);
  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = title ? `${title}.` : '';
  const publisherSegment = publisher ? `${publisher}.` : '';
  return joinNonEmpty([authorYearSegment, titleSegment, publisherSegment, pid]);
};
