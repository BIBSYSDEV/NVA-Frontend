import { Registration } from '../../../../../../../types/registration.types';
import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../../../../../../types/publication_types/journalRegistration.types';
import { formatAuthorYearSegment, formatPages, joinNonEmpty, normalizeBaseFields } from '../citation-helpers';
import { FormatAPAOptions, Formatter } from '../formatter.types';

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

const normalizeJournalArticleFields = (registration: Registration, options: FormatAPAOptions) => {
  const reference = registration.entityDescription?.reference;
  const publicationContext = reference?.publicationContext as JournalPublicationContext | undefined;
  const publicationInstance = reference?.publicationInstance as JournalPublicationInstance | undefined;
  return {
    ...normalizeBaseFields(registration),
    journalTitle: options.journalName?.trim() || publicationContext?.title?.trim() || '',
    volume: publicationInstance?.volume?.trim() ?? '',
    issue: publicationInstance?.issue?.trim() ?? '',
    pages: formatPages(publicationInstance?.pages),
  };
};

/**
 * Formats journal articles (AcademicArticle, AcademicLiteratureReview).
 * Shape: "Authors (year). Title. Journal, Volume(Issue), pages. DOI"
 */
export const formatJournalArticle: Formatter = (registration, options) => {
  const { authors, year, title, journalTitle, volume, issue, pages, pid } = normalizeJournalArticleFields(
    registration,
    options
  );
  const authorYearSegment = formatAuthorYearSegment(authors, year);
  const titleSegment = title ? `${title}.` : '';
  const journalSegment = formatJournalSegment(journalTitle, formatVolumeIssue(volume, issue), pages);
  return joinNonEmpty([authorYearSegment, titleSegment, journalSegment, pid]);
};
