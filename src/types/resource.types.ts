export enum resourceType {
  TEXT = 'text',
  FILE = 'file',
}

export interface titleType {
  en: string;
  no: string;
}

export interface Resource {
  creators: string[];
  handle: string;
  license: string;
  publicationYear: number;
  publisher: string;
  titles: titleType;
  type: resourceType;
}
