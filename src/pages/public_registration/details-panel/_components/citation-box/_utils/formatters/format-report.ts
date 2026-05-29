import { ReportPublicationContext } from '../../../../../../../types/publication_types/reportRegistration.types';
import {
  formatAuthorList,
  formatAuthorYearSegment,
  getCreators,
  getPersistentIdentifier,
  joinNonEmpty,
} from '../citation-helpers';
import { Formatter } from '../formatter.types';

/**
 * Formats reports (ReportResearch, ReportPolicy, etc.).
 * Shape: "Authors (year). Title (Report No. xx). Institution. DOI"
 * The report number is only attached when a title is present.
 */
export const formatReport: Formatter = (registration, options) => {
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
