export interface Reference {
  type: ReferenceType | '';
  journalArticle?: JournalArticle;
  book?: Book;
  report?: Report;
  degree?: Degree;
  chapter?: Chapter;
}

interface JournalArticle {
  type: JournalArticleType | '';
  publisher: Publisher;
  volume: string;
  issue: string;
  pagesFrom: string;
  pagesTo: string;
  peerReview: boolean;
  link: string;
  articleNumber: string;
}

interface Book {
  type: BookType | '';
  publisher: Publisher;
  isbn: string;
  peerReview: boolean;
  textBook: boolean;
  numberOfPages: string;
  series: Publisher;
}

interface Report {
  type: ReportType | '';
  publisher: Publisher;
  isbn: string;
  numberOfPages: string;
  series: Publisher;
}

interface Degree {
  type: DegreeType | '';
  publisher: Publisher;
  specialization: string;
  series: Publisher;
}

export interface Publisher {
  title: string;
  printIssn: string;
  onlineIssn: string;
  level: number | null;
  openAccess: boolean;
}

interface Chapter {
  link: string;
  pagesFrom: string;
  pagesTo: string;
  anthology: Book;
  publisher: Publisher;
}

export const emptyPublisher: Publisher = {
  printIssn: '',
  onlineIssn: '',
  level: null,
  title: '',
  openAccess: false,
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
  publisher: emptyPublisher,
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
  publisher: emptyPublisher,
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

export enum JournalArticleType {
  ARTICLE = 'article',
  SHORT_COMMUNICATION = 'shortCommunication',
  EDITORIAL = 'editorial',
  LETTER = 'letter',
  REVIEW = 'review',
}

export enum BookType {
  MONOGRAPHY = 'monography',
  ANTHOLOGY = 'anthology',
}

export enum ReportType {
  REPORT = 'report',
  RESEARCH_REPORT = 'researchReport',
  POLICY_REPORT = 'policyReport',
  WORKING_PAPER = 'workingPaper',
}

export enum DegreeType {
  BACHELOR = 'bachelor',
  MASTER = 'master',
  DOCTORATE = 'doctorate',
}

// Enums representing name of fields used by Formik
export enum ReferenceFieldNames {
  REFERENCE_TYPE = 'reference.type',
}

export enum JournalArticleFieldNames {
  TYPE = 'reference.journalArticle.type',
  DOI = 'reference.journalArticle.doi',
  PUBLISHER = 'reference.journalArticle.publisher',
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
  PUBLISHER = 'reference.chapter.publisher',
}
