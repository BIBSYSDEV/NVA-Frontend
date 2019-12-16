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
  SHORT_COMMUNICATION = 'shortCommunication',
  EDITORIAL = 'editorial',
  LETTER = 'letter',
  REVIEW = 'review',
}

export const journalPublicationTypes = [
  { label: 'references.article', value: JournalPublicationTypeValue.ARTICLE },
  { label: 'references.shortCommunication', value: JournalPublicationTypeValue.SHORT_COMMUNICATION },
  { label: 'references.editorial', value: JournalPublicationTypeValue.EDITORIAL },
  { label: 'references.letter', value: JournalPublicationTypeValue.LETTER },
  { label: 'references.review', value: JournalPublicationTypeValue.REVIEW },
];
