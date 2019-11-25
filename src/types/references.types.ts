export enum ReferenceType {
  PUBLICATION_IN_JOURNAL = 'Publication in journal',
  BOOK = 'Book',
  REPORT = 'Report',
  DEGREE = 'Degree',
  CHAPTER = 'Chapter',
}

export const referenceTypeList = [
  ReferenceType.PUBLICATION_IN_JOURNAL,
  ReferenceType.BOOK,
  ReferenceType.REPORT,
  ReferenceType.DEGREE,
  ReferenceType.CHAPTER,
];

export interface PublicationChannel {
  title: string;
  issn: string;
  level: string | null;
  publisher: string;
}
