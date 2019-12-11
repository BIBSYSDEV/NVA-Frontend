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
  issn: string;
  level: string | null;
  publisher: string;
}

enum JournalPublicationTypeValue {
  ARTICLE = 'article',
  REVIEW = 'review',
}

export const journalPublicationTypes = [
  { label: 'references.article', value: JournalPublicationTypeValue.ARTICLE },
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
