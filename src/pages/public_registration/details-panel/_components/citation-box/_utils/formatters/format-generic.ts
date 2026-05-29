import { formatAuthorYearSegment, joinNonEmpty, normalizeBaseFields } from '../citation-helpers';
import { Formatter } from '../formatter.types';

/**
 * Fallback formatter for instance types without a dedicated formatter.
 * Shape: "Authors (year). Title. DOI" — emits whichever fields are present.
 */
export const formatGeneric: Formatter = (registration) => {
  const { authors, year, title, pid } = normalizeBaseFields(registration);
  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = title ? `${title}.` : '';
  return joinNonEmpty([authorYearSegment, titleSegment, pid]);
};
