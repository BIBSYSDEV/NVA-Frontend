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
  PUBLISHED = 'published',
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

export const emptyNpiDiscipline: NpiDiscipline = {
  title: '',
  mainDiscipline: '',
};

export interface Publication {
  modified: string; // date?
  createdDate: string; // date?
  createdBy: string;
  doiLink: string;
  reference: Reference;
  authors: Contributor[];
  contributors: Contributor[];
  files: File[];
  status: PublicationStatus;
  shouldCreateDoi: boolean;

  // Fields from backend
  identifier: string;
  entityDescription: PublicationEntityDescription;
}

interface PublicationEntityDescription {
  mainTitle: string;
  abstract: string;
  description: string;
  tags: string[];
  npiDiscipline: NpiDiscipline;
  date: {
    year: string;
    month: string;
    day: string;
  };
  language: LanguageCodes;
  projects: Project[];
}

const emptyPublicationEntityDescription: PublicationEntityDescription = {
  mainTitle: '',
  abstract: '',
  description: '',
  tags: [],
  npiDiscipline: emptyNpiDiscipline,
  date: {
    year: '',
    month: '',
    day: '',
  },
  language: LanguageCodes.NORWEGIAN_BOKMAL,
  projects: [],
};

export type PublicationPreview = Pick<
  Publication & PublicationEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'status' | 'createdBy'
>;
export type PublishedPublicationPreview = Pick<
  Publication & PublicationEntityDescription,
  'identifier' | 'mainTitle' | 'date' | 'reference' | 'authors' | 'status'
>;

export interface Doi {
  identifier: string; // NVA identifier
  title: string;
}

export const emptyPublication: Publication = {
  modified: '', // date?
  createdDate: '', // date?
  createdBy: '',
  doiLink: '',

  reference: emptyReference,
  authors: [],
  contributors: [], // TODO: Merge with authors
  files: [],
  status: PublicationStatus.DRAFT,
  shouldCreateDoi: false,

  // Fields from backend
  identifier: '',
  entityDescription: emptyPublicationEntityDescription,
};
