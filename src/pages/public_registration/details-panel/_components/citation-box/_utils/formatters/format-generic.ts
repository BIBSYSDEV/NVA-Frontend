import {
  formatAuthorList,
  formatAuthorYearSegment,
  getCreators,
  getPersistentIdentifier,
  joinNonEmpty,
} from '../citation-helpers';
import { Formatter } from '../formatter.types';

/**
 * Fallback formatter for instance types without a dedicated formatter.
 * Shape: "Authors (year). Title. DOI" — emits whichever fields are present.
 */
export const formatGeneric: Formatter = (registration) => {
  const entityDescription = registration.entityDescription;
  const authors = formatAuthorList(getCreators(registration));
  const year = entityDescription?.publicationDate?.year?.trim() ?? '';
  const title = entityDescription?.mainTitle?.trim() ?? '';
  const pid = getPersistentIdentifier(registration);

  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = title ? `${title}.` : '';

  return joinNonEmpty([authorYearSegment, titleSegment, pid]);
};
