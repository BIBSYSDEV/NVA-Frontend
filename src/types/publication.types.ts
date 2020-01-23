import Contributor from './contributor.types';
import { Project } from './project.types';
import { emptyReference, Reference } from './references.types';
import { File } from './license.types';

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

export interface TitleType {
  [key: string]: string;
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

export interface AlmaPublication {
  title: string;
  date: string;
}

interface NpiDiscipline {
  title: string;
  mainDiscipline: string;
}

export interface Publication {
  id: string;
  modified: string; // date?
  createdDate: string; // date?
  createdBy: string;
  title: { [key: string]: string };
  abstract: string;
  description: string;
  npiDiscipline: NpiDiscipline;
  tags: string[];
  doiLink: string;
  publicationDate: {
    year: string;
    month: string;
    day: string;
  };
  language: string; // enum?
  projects: Project[];
  reference: Reference;
  authors: Contributor[];
  contributors: Contributor[];
  files: File[];
}

export const emptyNpiDiscipline = {
  title: '',
  mainDiscipline: '',
};

export const emptyPublication: Publication = {
  id: '',
  modified: '', // date?
  createdDate: '', // date?
  createdBy: '',
  title: {
    nb: '',
  },
  abstract: '',
  description: '',
  npiDiscipline: emptyNpiDiscipline,
  tags: [],
  doiLink: '',
  publicationDate: {
    year: '',
    month: '',
    day: '',
  },
  language: 'nb-NO', // enum?
  projects: [],
  reference: emptyReference,
  authors: [],
  contributors: [], // TODO: Merge with authors
  files: [],
};
