export enum ResourceType {
  TEXT = 'text',
  FILE = 'file',
}

export enum ResourceFormTabs {
  PUBLICATION,
  DESCRIPTION,
  REFERENCES,
  CONTRIBUTORS,
  FILES_AND_LICENSE,
}

export interface ResourceTitle {
  title: string;
}

export interface TitleType {
  en: ResourceTitle;
  no: ResourceTitle;
}

export interface ResourceMetadata {
  creators: string[];
  handle: string;
  license: string;
  publicationYear: number;
  publisher: string;
  titles: TitleType;
  type: ResourceType;
}

export interface ResourceFile {
  checksum: string;
  filename: string;
  mimetype: string;
  size: string;
}

export interface ResourceFileMap {
  indexedDate: string;
  file: ResourceFile;
}

export interface Resource {
  createdDate: string;
  files: ResourceFileMap[];
  metadata: ResourceMetadata;
  modifiedDate: string;
  owner: string;
  publishedDate: string;
  resourceIdentifier: string;
  status: string;
}
