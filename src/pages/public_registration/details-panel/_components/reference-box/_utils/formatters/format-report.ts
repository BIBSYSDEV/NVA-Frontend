import { Registration } from '../../../../../../../types/registration.types';
import { ReportPublicationContext } from '../../../../../../../types/publication_types/reportRegistration.types';
import { formatAuthorYearSegment, joinNonEmpty, normalizeBaseFields } from '../citation-helpers';
import { FormatAPAOptions, Formatter } from '../formatter.types';

const normalizeReportFields = (registration: Registration, options: FormatAPAOptions) => {
  const publicationContext = registration.entityDescription?.reference?.publicationContext as
    | ReportPublicationContext
    | undefined;
  return {
    ...normalizeBaseFields(registration),
    reportNumber: publicationContext?.seriesNumber?.trim() ?? '',
    institution: options.publisherName?.trim() || publicationContext?.publisher?.name?.trim() || '',
  };
};

/**
 * Formats reports (ReportResearch, ReportPolicy, etc.).
 * Shape: "Authors (year). Title (Report No. xx). Institution. DOI"
 * The report number is only attached when a title is present.
 */
export const formatReport: Formatter = (registration, options) => {
  const { authors, year, title, reportNumber, institution, pid } = normalizeReportFields(registration, options);
  const titleText = title && reportNumber ? `${title} (Report No. ${reportNumber})` : title;
  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = titleText ? `${titleText}.` : '';
  const institutionSegment = institution ? `${institution}.` : '';
  return joinNonEmpty([authorYearSegment, titleSegment, institutionSegment, pid]);
};
