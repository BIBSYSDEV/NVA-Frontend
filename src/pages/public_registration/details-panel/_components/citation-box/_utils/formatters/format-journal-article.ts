import {
  JournalPublicationContext,
  JournalPublicationInstance,
} from '../../../../../../../types/publication_types/journalRegistration.types';
import {
  formatAuthorList,
  formatAuthorYearSegment,
  formatPages,
  getCreators,
  getPersistentIdentifier,
  joinNonEmpty,
} from '../citation-helpers';
import { Formatter } from '../formatter.types';

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

/**
 * Formats journal articles (AcademicArticle, AcademicLiteratureReview).
 * Shape: "Authors (year). Title. Journal, Volume(Issue), pages. DOI"
 */
export const formatJournalArticle: Formatter = (registration, options) => {
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
