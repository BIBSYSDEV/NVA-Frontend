import { BookType, ChapterType, JournalType, ReportType } from '../../../../../../types/publicationFieldNames';
import { Registration } from '../../../../../../types/registration.types';
import { FormatAPAOptions, Formatter } from './formatter.types';
import { formatBook } from './formatters/format-book';
import { formatChapter } from './formatters/format-chapter';
import { formatGeneric } from './formatters/format-generic';
import { formatJournalArticle } from './formatters/format-journal-article';
import { formatReport } from './formatters/format-report';

const formattersByInstanceType: Record<string, Formatter> = {
  [JournalType.AcademicArticle]: formatJournalArticle,
  [JournalType.AcademicLiteratureReview]: formatJournalArticle,
  [BookType.AcademicMonograph]: formatBook,
  [BookType.AcademicCommentary]: formatBook,
  [BookType.NonFictionMonograph]: formatBook,
  [BookType.PopularScienceMonograph]: formatBook,
  [BookType.Textbook]: formatBook,
  [BookType.Encyclopedia]: formatBook,
  [BookType.ExhibitionCatalog]: formatBook,
  [BookType.Anthology]: formatBook,
  [ReportType.Research]: formatReport,
  [ReportType.Policy]: formatReport,
  [ReportType.WorkingPaper]: formatReport,
  [ReportType.BookOfAbstracts]: formatReport,
  [ReportType.ConferenceReport]: formatReport,
  [ReportType.Report]: formatReport,
  [ChapterType.AcademicChapter]: formatChapter,
  [ChapterType.NonFictionChapter]: formatChapter,
  [ChapterType.PopularScienceChapter]: formatChapter,
  [ChapterType.TextbookChapter]: formatChapter,
  [ChapterType.EncyclopediaChapter]: formatChapter,
  [ChapterType.Introduction]: formatChapter,
  [ChapterType.ExhibitionCatalogChapter]: formatChapter,
  [ChapterType.ReportChapter]: formatChapter,
  [ChapterType.ConferenceAbstract]: formatChapter,
};

/**
 * Formats a registration as an APA-style citation string.
 * Dispatches on publicationInstance.type to a type-specific formatter.
 * Falls back to a generic formatter (authors, year, title, DOI) for unhandled types.
 */
export const formatAPA = (registration: Registration, options: FormatAPAOptions = {}): string => {
  const instanceType = registration.entityDescription?.reference?.publicationInstance?.type;
  const formatter = (instanceType && formattersByInstanceType[instanceType]) || formatGeneric;
  return formatter(registration, options);
};
