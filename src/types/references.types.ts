import { EnumDictionary } from './common.types';

export interface Reference {
  type: ReferenceType | '';
  journalArticle?: JournalArticle;
  book?: Book;
  report?: Report;
  degree?: Degree;
  chapter?: Chapter;
}

interface JournalArticle {
  type: JournalArticleTypeValue | '';
  journal: Publisher;
  volume: string;
  issue: string;
  pagesFrom: string;
  pagesTo: string;
  peerReview: boolean;
  link: string;
  articleNumber: string;
}

interface Book {
  type: string;
  publisher: Publisher;
  isbn: string;
  peerReview: boolean;
  textBook: boolean;
  numberOfPages: string;
  series: Publisher;
}

interface Report {
  type: string;
  publisher: Publisher;
  isbn: string;
  numberOfPages: string;
  series: Publisher;
}

interface Degree {
  type: string;
  publisher: Publisher;
  specialization: string;
  series: Publisher;
}

export interface Publisher {
  title: string;
  printIssn: string;
  onlineIssn: string;
  level: number | null;
}

export interface Chapter {
  link: string;
  pagesFrom: string;
  pagesTo: string;
  anthology: Book;
}
export const emptyPublisher: Publisher = {
  printIssn: '',
  onlineIssn: '',
  level: null,
  title: '',
};

const emptyBookReference: Book = {
  type: '',
  publisher: emptyPublisher,
  isbn: '',
  peerReview: false,
  textBook: false,
  numberOfPages: '',
  series: emptyPublisher,
};

const emptyJournalArticleReference: JournalArticle = {
  type: '',
  link: '',
  journal: emptyPublisher,
  volume: '',
  issue: '',
  peerReview: false,
  pagesFrom: '',
  pagesTo: '',
  articleNumber: '',
};

const emptyReportReference: Report = {
  type: '',
  publisher: emptyPublisher,
  isbn: '',
  numberOfPages: '',
  series: emptyPublisher,
};

const emptyDegreeReference: Degree = {
  type: '',
  publisher: emptyPublisher,
  specialization: '',
  series: emptyPublisher,
};

const emptyChapterReference: Chapter = {
  link: '',
  pagesFrom: '',
  pagesTo: '',
  anthology: emptyBookReference,
};

export const emptyReference: Reference = {
  type: '',
  journalArticle: emptyJournalArticleReference,
  book: emptyBookReference,
  report: emptyReportReference,
  degree: emptyDegreeReference,
  chapter: emptyChapterReference,
};

export enum ReferenceType {
  PUBLICATION_IN_JOURNAL = 'journalArticle',
  BOOK = 'book',
  REPORT = 'report',
  DEGREE = 'degree',
  CHAPTER = 'chapter',
}

export const referenceTypeLanguageKeyMap: EnumDictionary<string, string> = {
  [ReferenceType.PUBLICATION_IN_JOURNAL]: 'references.journal_publication',
  [ReferenceType.BOOK]: 'references.book',
  [ReferenceType.REPORT]: 'references.report',
  [ReferenceType.DEGREE]: 'references.degree',
  [ReferenceType.CHAPTER]: 'references.chapter',
};

enum JournalArticleTypeValue {
  ARTICLE = 'article',
  SHORT_COMMUNICATION = 'shortCommunication',
  EDITORIAL = 'editorial',
  LETTER = 'letter',
  REVIEW = 'review',
}

export const journalArticleTypes = [
  { label: 'references.article', value: JournalArticleTypeValue.ARTICLE },
  { label: 'references.short_communication', value: JournalArticleTypeValue.SHORT_COMMUNICATION },
  { label: 'references.editorial', value: JournalArticleTypeValue.EDITORIAL },
  { label: 'references.letter', value: JournalArticleTypeValue.LETTER },
  { label: 'references.review', value: JournalArticleTypeValue.REVIEW },
];

export enum BookTypeValue {
  MONOGRAPHY = 'monography',
  ANTHOLOGY = 'anthology',
}

export const bookTypes = [
  { label: 'references.monography', value: BookTypeValue.MONOGRAPHY },
  { label: 'references.anthology', value: BookTypeValue.ANTHOLOGY },
];

export enum ReportTypeValue {
  REPORT = 'report',
  RESEARCH_REPORT = 'research_report',
  POLICY_REPORT = 'policy_report',
  WORKING_PAPER = 'working_paper',
}

export const reportTypes = [
  { label: 'references.report', value: ReportTypeValue.REPORT },
  { label: 'references.research_report', value: ReportTypeValue.RESEARCH_REPORT },
  { label: 'references.policy_report', value: ReportTypeValue.POLICY_REPORT },
  { label: 'references.working_paper', value: ReportTypeValue.WORKING_PAPER },
];

export enum DegreeTypeValue {
  BACHELOR = 'bachelor',
  MASTER = 'master',
  DOCTORATE = 'doctorate',
}

export const degreeTypes = [
  { label: 'references.bachelor', value: DegreeTypeValue.BACHELOR },
  { label: 'references.master', value: DegreeTypeValue.MASTER },
  { label: 'references.doctorate', value: DegreeTypeValue.DOCTORATE },
];

// Enums representing name of fields used by Formik
export enum ReferenceFieldNames {
  REFERENCE_TYPE = 'reference.type',
}

export enum JournalArticleFieldNames {
  TYPE = 'reference.journalArticle.type',
  DOI = 'reference.journalArticle.doi',
  JOURNAL = 'reference.journalArticle.journal',
  VOLUME = 'reference.journalArticle.volume',
  ISSUE = 'reference.journalArticle.issue',
  PAGES_FROM = 'reference.journalArticle.pagesFrom',
  PAGES_TO = 'reference.journalArticle.pagesTo',
  ARTICLE_NUMBER = 'reference.journalArticle.articleNumber',
  PEER_REVIEW = 'reference.journalArticle.peerReview',
}

export enum BookFieldNames {
  TYPE = 'reference.book.type',
  PUBLISHER = 'reference.book.publisher',
  ISBN = 'reference.book.isbn',
  PEER_REVIEW = 'reference.book.peerReview',
  TEXT_BOOK = 'reference.book.textBook',
  NUMBER_OF_PAGES = 'reference.book.numberOfPages',
  SERIES = 'reference.book.series',
}

export enum ReportFieldNames {
  TYPE = 'reference.report.type',
  PUBLISHER = 'reference.report.publisher',
  ISBN = 'reference.report.isbn',
  NUMBER_OF_PAGES = 'reference.report.numberOfPages',
  SERIES = 'reference.report.series',
}

export enum DegreeFieldNames {
  TYPE = 'reference.degree.type',
  PUBLISHER = 'reference.degree.publisher',
  SPECIALISATION = 'reference.degree.numberOfPages',
  SERIES = 'reference.degree.series',
}

export enum ChapterFieldNames {
  LINK = 'reference.chapter.link',
  ANTHOLOGY = 'reference.chapter.anthology',
  PAGES_FROM = 'reference.chapter.pagesFrom',
  PAGES_TO = 'reference.chapter.pagesTo',
}
