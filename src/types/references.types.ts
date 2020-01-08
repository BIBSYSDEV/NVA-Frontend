export interface Reference {
  type: ReferenceType | '';
  journalPublication?: journalPublication;
  book?: Book;
  report?: Report;
}

interface journalPublication {
  type: JournalPublicationTypeValue | '';
  journal: PublicationChannel;
  issue: string;
  pagesFrom: string;
  pagesTo: string;
  peerReview: boolean;
  link: string;
  articleNumber: string;
}

interface Book {
  type: string;
  publisher: string;
}

interface Report {}

export interface PublicationChannel {
  title: string;
  issn: string;
  level: string;
  publisher: string;
}

export enum ReferenceType {
  PUBLICATION_IN_JOURNAL = 'journalPublication',
  BOOK = 'book',
  REPORT = 'report',
  DEGREE = 'degree',
  CHAPTER = 'chapter',
}

enum JournalPublicationTypeValue {
  ARTICLE = 'article',
  SHORT_COMMUNICATION = 'shortCommunication',
  EDITORIAL = 'editorial',
  LETTER = 'letter',
  REVIEW = 'review',
}

enum BookTypeValue {
  MONOGRAPHY = 'monography',
  ANTHOLOGY = 'anthology',
}

// Arrays of types, with i18n-key for label and values
export const referenceTypeList = [
  { label: 'references.journal_publication', value: ReferenceType.PUBLICATION_IN_JOURNAL },
  { label: 'references.book', value: ReferenceType.BOOK },
  { label: 'references.report', value: ReferenceType.REPORT },
  { label: 'references.degree', value: ReferenceType.DEGREE },
  { label: 'references.chapter', value: ReferenceType.CHAPTER },
];

export const journalPublicationTypes = [
  { label: 'references.article', value: JournalPublicationTypeValue.ARTICLE },
  { label: 'references.short_communication', value: JournalPublicationTypeValue.SHORT_COMMUNICATION },
  { label: 'references.editorial', value: JournalPublicationTypeValue.EDITORIAL },
  { label: 'references.letter', value: JournalPublicationTypeValue.LETTER },
  { label: 'references.review', value: JournalPublicationTypeValue.REVIEW },
];

export const bookTypes = [
  { label: 'references.monography', value: BookTypeValue.MONOGRAPHY },
  { label: 'references.anthology', value: BookTypeValue.ANTHOLOGY },
];

// Enums representing name of fields used by Formik
export enum ReferenceFieldNames {
  REFERENCE_TYPE = 'reference.type',
}

export enum journalPublicationFieldNames {
  TYPE = 'reference.journalPublication.type',
  DOI = 'reference.journalPublication.doi',
}

export enum BookFieldNames {
  TYPE = 'reference.book.type',
  PUBLISHER = 'reference.book.publisher',
}
