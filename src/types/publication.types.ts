import { Contributor } from './contributor.types';
import { File } from './file.types';
import { LanguageCodes } from './language.types';
import { Project } from './project.types';
import { emptyReference, Reference } from './references.types';

export enum PublicationType {
  TEXT = 'text',
  FILE = 'file',
}

export enum PublicationStatus {
  DRAFT = 'draft',
  REJECTED = 'rejected',
}

interface TitleType {
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

export interface AlmaPublication {
  title: string;
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
  status: PublicationStatus;
  shouldCreateDoi: boolean;
}

export type PublicationPreview = Pick<Publication, 'id' | 'title' | 'createdDate' | 'status'>;

export interface Doi {
  title: string;
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
  language: LanguageCodes.NORWEGIAN_BOKMAL,
  projects: [],
  reference: emptyReference,
  authors: [],
  contributors: [], // TODO: Merge with authors
  files: [],
  status: PublicationStatus.DRAFT,
  shouldCreateDoi: false,
};
