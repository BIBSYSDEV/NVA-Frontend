export interface Reference {
  book?: Book;
  chapter?: Chapter;
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

export interface Publisher {
  title: string;
  printIssn: string;
  onlineIssn: string;
  level: number | null;
  openAccess: boolean;
}

interface Chapter {
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

const emptyChapterReference: Chapter = {
  pagesFrom: '',
  pagesTo: '',
  anthology: emptyBookReference,
  publisher: emptyPublisher,
};

export const emptyReference: Reference = {
  book: emptyBookReference,
  chapter: emptyChapterReference,
};

// For valid values, see https://github.com/BIBSYSDEV/nva-datamodel-java/blob/develop/src/main/java/no/unit/nva/model/PublicationType.java
export enum ReferenceType {
  PUBLICATION_IN_JOURNAL = 'JournalArticle',
  BOOK = 'Book',
  REPORT = 'Report',
  DEGREE = 'Degree',
  CHAPTER = 'Chapter',
}

export enum JournalArticleType {
  ARTICLE = 'Article',
  SHORT_COMMUNICATION = 'ShortCommunication',
  EDITORIAL = 'Editorial',
  LETTER = 'Letter',
  REVIEW = 'Review',
}

export enum BookType {
  MONOGRAPHY = 'monography',
  ANTHOLOGY = 'anthology',
}

export enum ReportType {
  REPORT = 'Report',
  RESEARCH_REPORT = 'ResearchReport',
  POLICY_REPORT = 'PolicyReport',
  WORKING_PAPER = 'WorkingPaper',
}

export enum DegreeType {
  BACHELOR = 'Bachelor',
  MASTER = 'Master',
  DOCTORATE = 'Doctorate',
}

// Enums representing name of fields used by Formik
export enum ReferenceFieldNames {
  PUBLICATION_TYPE = 'entityDescription.publicationType',
  DOI = 'entityDescription.doiUrl',
}

export enum JournalArticleFieldNames {
  SUB_TYPE = 'entityDescription.publicationSubtype',
  PUBLISHER = 'entityDescription.publisher',
  VOLUME = 'entityDescription.volume',
  ISSUE = 'entityDescription.issue',
  PAGES_FROM = 'entityDescription.pagesFrom',
  PAGES_TO = 'entityDescription.pagesTo',
  ARTICLE_NUMBER = 'entityDescription.articleNumber',
  PEER_REVIEW = 'entityDescription.peerReview',
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
  SUB_TYPE = 'entityDescription.publicationSubtype',
  PUBLISHER = 'entityDescription.publisher',
  ISBN = 'entityDescription.isbn',
  NUMBER_OF_PAGES = 'entityDescription.numberOfPages',
  SERIES = 'entityDescription.series',
}

export enum DegreeFieldNames {
  SUB_TYPE = 'entityDescription.publicationSubtype',
  PUBLISHER = 'entityDescription.publisher',
  SPECIALISATION = 'entityDescription.numberOfPages',
  SERIES = 'entityDescription.series',
}

export enum ChapterFieldNames {
  ANTHOLOGY = 'reference.chapter.anthology',
  PAGES_FROM = 'reference.chapter.pagesFrom',
  PAGES_TO = 'reference.chapter.pagesTo',
  PUBLISHER = 'reference.chapter.publisher',
}
