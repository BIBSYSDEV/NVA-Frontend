import { Contributor } from './contributor.types';
import { FileSet } from './file.types';
import { LanguageValues } from './language.types';
import { Project } from './project.types';
import { PublicationType, JournalArticleType, ReportType, DegreeType, BookType } from './publicationFieldNames';
import { EnumDictionary } from './common.types';

export enum BackendTypeNames {
  APPROVAL = 'Approval',
  CONTRIBUTOR = 'Contributor',
  CUSTOMER = 'Customer',
  ENTITY_DESCRIPTION = 'EntityDescription',
  FILE = 'File',
  FILE_SET = 'FileSet',
  GRANT = 'Grant',
  IDENTITY = 'Identity',
  LICENSE = 'License',
  ORGANIZATION = 'Organization',
  PAGES = 'Range', // TODO: set this when backend has decided what it means
  PUBLICATION = 'Publication',
  PUBLICATION_DATE = 'PublicationDate',
  REFERENCE = 'Reference',
  RESEARCH_PROJECT = 'ResearchProject',
}

export enum PublicationStatus {
  NEW = 'New',
  PUBLISHED = 'Published',
}

export const levelMap: EnumDictionary<string, number | null> = {
  NO_LEVEL: null,
  LEVEL_0: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
};

export interface BackendType {
  type: BackendTypeNames | '';
}

export interface Publisher extends BackendType {
  title: string;
  printIssn: string;
  onlineIssn: string;
  level: string | number | null;
  openAccess: boolean;
}

export const emptyPublisher: Publisher = {
  type: '',
  printIssn: '',
  onlineIssn: '',
  level: null,
  title: '',
  openAccess: false,
};

export interface AlmaPublication {
  title: string;
}

export interface NpiDiscipline {
  id: string;
  name: string;
  mainDiscipline: string;
}

export interface Publication extends BackendType {
  readonly identifier: string;
  readonly createdDate: string;
  readonly owner: string;
  readonly status: PublicationStatus;
  entityDescription: PublicationEntityDescription;
  fileSet: FileSet;
  project: Project | null;
}

interface PublicationDate extends BackendType {
  year: string;
  month: string;
  day: string;
}

interface PublicationPages extends BackendType {
  begin: string;
  end: string;
}

interface PublicationInstance {
  type: JournalArticleType | ReportType | DegreeType | BookType | '';
  articleNumber: string;
  issue: string;
  pages: PublicationPages;
  peerReviewed: boolean;
  volume: string;
}

interface PublicationReference extends BackendType {
  doi: string;
  publicationInstance: PublicationInstance;
  publicationContext: Publisher | null;
}

interface PublicationEntityDescription extends BackendType {
  mainTitle: string;
  abstract: string;
  description: string;
  tags: string[];
  npiSubjectHeading: string;
  date: PublicationDate;
  language: LanguageValues;
  publicationType: PublicationType | '';
  contributors: Contributor[];
  isbn: string;
  numberOfPages: string;
  series: Publisher;
  specialization: string;
  textBook: boolean;
  reference: PublicationReference;
}

export interface FormikPublication extends Publication {
  shouldCreateDoi: boolean;
}

const emptyDate: PublicationDate = {
  type: BackendTypeNames.PUBLICATION_DATE,
  year: '',
  month: '',
  day: '',
};

const emptyPages: PublicationPages = {
  type: BackendTypeNames.PAGES,
  begin: '',
  end: '',
};

const emptyPublicationInstance: PublicationInstance = {
  type: '',
  volume: '',
  issue: '',
  articleNumber: '',
  pages: emptyPages,
  peerReviewed: false,
};

const emptyReference: PublicationReference = {
  type: BackendTypeNames.REFERENCE,
  doi: '',
  publicationInstance: emptyPublicationInstance,
  publicationContext: null,
};

const emptyPublicationEntityDescription: PublicationEntityDescription = {
  type: BackendTypeNames.ENTITY_DESCRIPTION,
  mainTitle: '',
  abstract: '',
  description: '',
  tags: [],
  npiSubjectHeading: '',
  date: emptyDate,
  language: LanguageValues.NORWEGIAN_BOKMAL,
  publicationType: '',
  contributors: [],
  isbn: '',
  numberOfPages: '',
  series: emptyPublisher,
  specialization: '',
  textBook: false,
  reference: emptyReference,
};

export type PublicationPreview = Pick<
  Publication & PublicationEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'status' | 'owner'
>;
export type PublishedPublicationPreview = Pick<
  Publication & PublicationEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'reference' | 'contributors' | 'status' | 'publicationType'
>;

export interface Doi {
  identifier: string; // NVA identifier
  title: string;
}

export const emptyPublication: FormikPublication = {
  type: BackendTypeNames.PUBLICATION,
  identifier: '',
  createdDate: '',
  owner: '',
  status: PublicationStatus.NEW,
  entityDescription: emptyPublicationEntityDescription,
  fileSet: {
    type: BackendTypeNames.FILE_SET,
    files: [],
  },
  shouldCreateDoi: false,
  project: null,
};
