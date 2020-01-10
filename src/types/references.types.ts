export interface Reference {
  type: ReferenceType | '';
  journalArticle?: JournalArticle;
  book?: Book;
  report?: Report;
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

export interface Publisher {
  title: string;
  printIssn: string;
  onlineIssn: string;
  level: number | null;
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

export const emptyReference: Reference = {
  type: '',
  journalArticle: emptyJournalArticleReference,
  book: emptyBookReference,
  report: emptyReportReference,
};

type EnumDictionary<T extends string, U> = {
  [K in T]: U;
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
