export enum BackendTypeNames {
  CONTRIBUTOR = 'Contributor',
  CUSTOMER = 'Customer',
  ENTITY_DESCRIPTION = 'EntityDescription',
  FILE = 'File',
  FILE_SET = 'FileSet',
  IDENTITY = 'Identity',
  INDEX_DATE = 'IndexDate',
  LICENSE = 'License',
  ORGANIZATION = 'Organization',
  PAGES_MONOGRAPH = 'MonographPages',
  PAGES_RANGE = 'Range',
  PUBLICATION = 'Publication',
  PUBLICATION_DATE = 'PublicationDate',
  REFERENCE = 'Reference',
}

export interface NviApplicableBase<T> {
  contentType: T | null;
  peerReviewed: boolean | null;
  originalResearch: boolean | null;
}

export const emptyDate = {
  type: BackendTypeNames.PUBLICATION_DATE,
  year: '',
  month: '',
  day: '',
};

export interface LanguageString {
  [key: string]: string;
}
