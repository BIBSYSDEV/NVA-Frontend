import { PublicationFileSet } from './file.types';
import { Project } from './project.types';
import { EnumDictionary } from './common.types';
import {
  JournalEntityDescription,
  JournalPublicationContext,
  emptyPublicationEntityDescription,
} from './publication_types/journal.publication.types';

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
  entityDescription: JournalEntityDescription;
  project: Project | null;
}

export interface PublicationDate extends BackendType {
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

export const emptyDate: PublicationDate = {
  type: BackendTypeNames.PUBLICATION_DATE,
  year: '',
  month: '',
  day: '',
};

export type PublicationPreview = Pick<
  Publication & JournalEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'status' | 'owner'
>;

export type PublishedPublicationPreview = Pick<
  Publication & JournalEntityDescription & JournalPublicationContext,
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
