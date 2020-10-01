import { PublicationFileSet } from './file.types';
import { Project } from './project.types';
import { EnumDictionary } from './common.types';
import {
  JournalEntityDescription,
  JournalPublicationContext,
  emptyPublicationEntityDescription,
} from './publication_types/journalPublication.types';
import { DegreeEntityDescription } from './publication_types/degreePublication.types';
import { BookEntityDescription } from './publication_types/bookPublication.types';
import { ReportEntityDescription } from './publication_types/reportPublication.types';
import { BackendTypeNames } from './publication_types/commonPublication.types';

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

export interface DoiRequestMessage {
  text: string;
  author: string;
  timestamp: string;
}

interface DoiRequest {
  type: string;
  date: string;
  status: DoiRequestStatus;
  messages: DoiRequestMessage[];
}

interface PublicationPublisher {
  id: string;
}

interface BasePublication extends BackendType, PublicationFileSet {
  readonly identifier: string;
  readonly createdDate: string;
  readonly owner: string;
  readonly status: PublicationStatus;
  readonly doiRequest?: DoiRequest;
  readonly publisher: PublicationPublisher;
  project: Project | null;
}
export interface Publication extends BasePublication {
  entityDescription:
    | JournalEntityDescription
    | DegreeEntityDescription
    | BookEntityDescription
    | ReportEntityDescription;
}

export interface JournalPublication extends BasePublication {
  entityDescription: JournalEntityDescription;
}

export interface DegreePublication extends BasePublication {
  entityDescription: DegreeEntityDescription;
}

export interface BookPublication extends BasePublication {
  entityDescription: BookEntityDescription;
}

export interface ReportPublication extends BasePublication {
  entityDescription: ReportEntityDescription;
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

export const emptyPagesRange: PagesRange = {
  type: BackendTypeNames.PAGES_RANGE,
  begin: '',
  end: '',
};

export interface PagesMonograph extends BackendType {
  pages: string;
}

export const emptyPagesMonograph: PagesMonograph = {
  type: BackendTypeNames.PAGES_MONOGRAPH,
  pages: '',
};

export type PublicationPreview = Pick<
  Publication & JournalEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'status' | 'owner'
>;

export type PublishedPublicationPreview = Pick<
  Publication & JournalEntityDescription & JournalPublicationContext,
  'identifier' | 'mainTitle' | 'createdDate' | 'reference' | 'contributors' | 'status' | 'type'
>;

export interface Doi {
  identifier: string; // NVA identifier
  title: string;
}

export const emptyPublication: Publication = {
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
  project: null,
  publisher: { id: '' },
};
