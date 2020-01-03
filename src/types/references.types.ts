export enum ReferenceType {
  PUBLICATION_IN_JOURNAL = 'journalPublication',
  BOOK = 'book',
  REPORT = 'report',
  DEGREE = 'degree',
  CHAPTER = 'chapter',
}

export const referenceTypeList = [
  { label: 'references.journal_publication', value: ReferenceType.PUBLICATION_IN_JOURNAL },
  { label: 'references.book', value: ReferenceType.BOOK },
  { label: 'references.report', value: ReferenceType.REPORT },
  { label: 'references.degree', value: ReferenceType.DEGREE },
  { label: 'references.chapter', value: ReferenceType.CHAPTER },
];

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

enum BookTypeValue {
  MONOGRAPHY = 'monography',
  ANTHOLOGY = 'anthology',
}

export const bookTypes = [
  { label: 'references.monography', value: BookTypeValue.MONOGRAPHY },
  { label: 'references.anthology', value: BookTypeValue.ANTHOLOGY },
];

// Values represent name for fields used by Formik
export enum ReferenceFieldNames {
  REFERENCE_TYPE = 'reference.referenceType',
}

export enum journalPublicationFieldNames {
  TYPE = 'reference.journalPublication.type',
  DOI = 'reference.journalPublication.doi',
}

export enum BookFieldNames {
  TYPE = 'reference.book.type',
  PUBLISHER = 'reference.book.publisher',
}
