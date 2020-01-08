type EnumDictionary<T extends string, U> = {
  [K in T]: U;
};

export enum ReferenceType {
  PUBLICATION_IN_JOURNAL = 'journalPublication',
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

export interface PublicationChannel {
  title: string;
  level: string | null;
  publisher: string;
}

enum JournalPublicationTypeValue {
  ARTICLE = 'article',
  SHORT_COMMUNICATION = 'shortCommunication',
  EDITORIAL = 'editorial',
  LETTER = 'letter',
  REVIEW = 'review',
}

export const journalPublicationTypes = [
  { label: 'references.article', value: JournalPublicationTypeValue.ARTICLE },
  { label: 'references.short_communication', value: JournalPublicationTypeValue.SHORT_COMMUNICATION },
  { label: 'references.editorial', value: JournalPublicationTypeValue.EDITORIAL },
  { label: 'references.letter', value: JournalPublicationTypeValue.LETTER },
  { label: 'references.review', value: JournalPublicationTypeValue.REVIEW },
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
  MONOGRAPHY = 'monography',
  ANTHOLOGY = 'anthology',
}

export const reportTypes = [
  { label: 'references.monography', value: BookTypeValue.MONOGRAPHY },
  { label: 'references.anthology', value: BookTypeValue.ANTHOLOGY },
];

// Values represent name for fields used by Formik
export enum ReferenceFieldNames {
  REFERENCE_TYPE = 'reference.referenceType',
}

export enum JournalPublicationFieldNames {
  TYPE = 'reference.journalPublication.type',
  DOI = 'reference.journalPublication.doi',
  JOURNAL = 'reference.journalPublication.journal',
  VOLUME = 'reference.journalPublication.volume',
  ISSUE = 'reference.journalPublication.issue',
  PAGES_FROM = 'reference.journalPublication.pagesFrom',
  PAGES_TO = 'reference.journalPublication.pagesTo',
  ARTICLE_NUMBER = 'reference.journalPublication.articleNumber',
  PEER_REVIEW = 'reference.journalPublication.peerReview',
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
  TYPE = 'reference.book.type',
  PUBLISHER = 'reference.book.publisher',
  ISBN = 'reference.book.isbn',
  NUMBER_OF_PAGES = 'reference.book.numberOfPages',
  SERIES = 'reference.book.series',
}
