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

interface Report {}

export interface Publisher {
  title: string;
  issn: string;
  level: string;
  publisher: string;
}

export const emptyPublisher: Publisher = {
  issn: '',
  level: '',
  publisher: '',
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

export const emptyReference: Reference = {
  type: '',
  journalArticle: emptyJournalArticleReference,
  book: emptyBookReference,
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
