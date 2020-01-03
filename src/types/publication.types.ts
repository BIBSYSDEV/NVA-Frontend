export enum PublicationType {
  TEXT = 'text',
  FILE = 'file',
}

export enum PublicationFormTabs {
  PUBLICATION,
  DESCRIPTION,
  REFERENCES,
  CONTRIBUTORS,
  FILES_AND_LICENSE,
}

export interface PublicationTitle {
  title: string;
}

export interface TitleType {
  en: PublicationTitle;
  no: PublicationTitle;
}

export interface PublicationMetadata {
  creators: string[];
  handle: string;
  license: string;
  publicationYear: number;
  publisher: string;
  titles: TitleType;
  type: PublicationType;
}

export interface PublicationFile {
  checksum: string;
  filename: string;
  mimetype: string;
  size: string;
}

export interface PublicationFileMap {
  indexedDate: string;
  file: PublicationFile;
}

export interface Publication {
  createdDate: string;
  files: PublicationFileMap[];
  metadata: PublicationMetadata;
  modifiedDate: string;
  owner: string;
  publishedDate: string;
  publicationIdentifier: string;
  status: string;
}

export interface AlmaPublication {
  title: string;
  date: string;
}

export interface DoiPublication {
  url: string;
  owner: string;
}
