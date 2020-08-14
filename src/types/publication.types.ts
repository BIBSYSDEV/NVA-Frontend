import { Contributor } from './contributor.types';
import { PublicationFileSet } from './file.types';
import { LanguageValues } from './language.types';
import { Project } from './project.types';
import { PublicationType, JournalType, ReportType, DegreeType, BookType } from './publicationFieldNames';
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
  PAGES_MONOGRAPH = 'MonographPages',
  PAGES_RANGE = 'Range',
  PUBLICATION = 'Publication',
  PUBLICATION_DATE = 'PublicationDate',
  REFERENCE = 'Reference',
  RESEARCH_PROJECT = 'ResearchProject',
}

export enum PublicationStatus {
  DELETED = 'Deleted',
  DRAFT = 'Draft',
  NEW = 'New',
  PUBLISHED = 'Published',
}

export enum PublicationTab {
  Description = 0,
  Reference = 1,
  Contributors = 2,
  FilesAndLicenses = 3,
  Submission = 4,
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

export interface Publisher {
  type: string;
  title: string;
  onlineIssn: string;
  level: string | number | null;
  openAccess: boolean;
}

export const emptyPublisher: Publisher = {
  type: '',
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

export enum DoiRequestStatus {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Requested = 'REQUESTED',
}

interface DoiRequest {
  type: string;
  date: string;
  status: DoiRequestStatus;
}

export interface Publication extends BackendType, PublicationFileSet {
  readonly identifier: string;
  readonly createdDate: string;
  readonly owner: string;
  readonly status: PublicationStatus;
  readonly doiRequest: DoiRequest | null;
  doiRequested: boolean;
  entityDescription: PublicationEntityDescription;
  project: Project | null;
}

interface PublicationDate extends BackendType {
  year: string;
  month: string;
  day: string;
}

export interface PagesRange extends BackendType {
  begin: string;
  end: string;
}

export interface PagesMonograph extends BackendType {
  pages: string;
}

interface PublicationInstance {
  type: JournalType | ReportType | DegreeType | BookType | '';
  articleNumber: string;
  issue: string;
  pages: PagesRange | PagesMonograph | null;
  peerReviewed: boolean;
  volume: string;
}

interface PublicationContext {
  type: PublicationType | '';
  level: string | number | null;
  onlineIssn: string;
  openAccess: boolean;
  peerReviewed: boolean;
  title: string;
  url?: string;
  seriesTitle?: string;
}

interface PublicationReference extends BackendType {
  doi: string;
  publicationInstance: PublicationInstance;
  publicationContext: PublicationContext;
}

interface PublicationEntityDescription extends BackendType {
  mainTitle: string;
  abstract: string;
  description: string;
  tags: string[];
  npiSubjectHeading: string;
  date: PublicationDate;
  language: LanguageValues;
  contributors: Contributor[];
  isbn: string;
  specialization: string;
  textBook: boolean;
  reference: PublicationReference;
}

const emptyDate: PublicationDate = {
  type: BackendTypeNames.PUBLICATION_DATE,
  year: '',
  month: '',
  day: '',
};

const emptyPublicationInstance: PublicationInstance = {
  type: '',
  volume: '',
  issue: '',
  articleNumber: '',
  pages: null,
  peerReviewed: false,
};

const emptyPublicationContext: PublicationContext = {
  type: '',
  level: '',
  onlineIssn: '',
  openAccess: false,
  peerReviewed: false,
  title: '',
  url: '',
  seriesTitle: '',
};

const emptyReference: PublicationReference = {
  type: BackendTypeNames.REFERENCE,
  doi: '',
  publicationInstance: emptyPublicationInstance,
  publicationContext: emptyPublicationContext,
};

const emptyPublicationEntityDescription: PublicationEntityDescription = {
  type: BackendTypeNames.ENTITY_DESCRIPTION,
  mainTitle: '',
  abstract: '',
  description: '',
  tags: [],
  npiSubjectHeading: '',
  date: emptyDate,
  language: LanguageValues.NONE,
  contributors: [],
  isbn: '',
  specialization: '',
  textBook: false,
  reference: emptyReference,
};

export type PublicationPreview = Pick<
  Publication & PublicationEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'status' | 'owner'
>;

export type PublishedPublicationPreview = Pick<
  Publication & PublicationEntityDescription & PublicationContext,
  'identifier' | 'mainTitle' | 'createdDate' | 'reference' | 'contributors' | 'status' | 'type'
>;

export interface PublicationListItem extends PublicationPreview {
  modifiedDate: string;
}

export interface Doi {
  identifier: string; // NVA identifier
  title: string;
}

export const emptyPublication: Publication = {
  type: BackendTypeNames.PUBLICATION,
  identifier: '',
  createdDate: '',
  doiRequest: null,
  doiRequested: false,
  owner: '',
  status: PublicationStatus.NEW,
  entityDescription: emptyPublicationEntityDescription,
  fileSet: {
    type: BackendTypeNames.FILE_SET,
    files: [],
  },
  project: null,
};
