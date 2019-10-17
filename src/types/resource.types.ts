export enum ResourceType {
  TEXT = 'text',
  FILE = 'file',
}

export interface TitleType {
  en: string;
  no: string;
}

export interface Resource {
  creators: string[];
  handle: string;
  license: string;
  publicationYear: number;
  publisher: string;
  titles: TitleType;
  type: ResourceType;
}
