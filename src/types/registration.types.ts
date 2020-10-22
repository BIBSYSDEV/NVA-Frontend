import { RegistrationFileSet } from './file.types';
import { ResearchProject } from './project.types';
import { EnumDictionary } from './common.types';
import {
  JournalEntityDescription,
  emptyRegistrationEntityDescription,
} from './publication_types/journalRegistration.types';
import { DegreeEntityDescription } from './publication_types/degreeRegistration.types';
import { BookEntityDescription } from './publication_types/bookRegistration.types';
import { ReportEntityDescription } from './publication_types/reportRegistration.types';
import { BackendTypeNames } from './publication_types/commonRegistration.types';

export enum RegistrationStatus {
  DELETED = 'Deleted',
  DRAFT = 'Draft',
  NEW = 'New',
  PUBLISHED = 'Published',
}

export enum RegistrationTab {
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

export interface AlmaRegistration {
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

interface RegistrationPublisher {
  id: string;
}

interface BaseRegistration extends BackendType, RegistrationFileSet {
  readonly identifier: string;
  readonly createdDate: string;
  readonly owner: string;
  readonly status: RegistrationStatus;
  readonly doiRequest?: DoiRequest;
  readonly publisher: RegistrationPublisher;
  project: ResearchProject | null;
}

export interface Registration extends BaseRegistration {
  entityDescription:
    | JournalEntityDescription
    | DegreeEntityDescription
    | BookEntityDescription
    | ReportEntityDescription;
}

export interface JournalRegistration extends BaseRegistration {
  entityDescription: JournalEntityDescription;
}

export interface DegreeRegistration extends BaseRegistration {
  entityDescription: DegreeEntityDescription;
}

export interface BookRegistration extends BaseRegistration {
  entityDescription: BookEntityDescription;
}

export interface ReportRegistration extends BaseRegistration {
  entityDescription: ReportEntityDescription;
}

export interface RegistrationDate extends BackendType {
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

export const emptyPagesMonograph: PagesMonograph = {
  type: BackendTypeNames.PAGES_MONOGRAPH,
  pages: '',
};

export type RegistrationPreview = Pick<
  Registration & JournalEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'status' | 'owner'
>;

export interface Doi {
  identifier: string; // NVA identifier
  title: string;
}

export const emptyRegistration: Registration = {
  type: BackendTypeNames.PUBLICATION,
  identifier: '',
  createdDate: '',
  owner: '',
  status: RegistrationStatus.NEW,
  entityDescription: emptyRegistrationEntityDescription,
  fileSet: {
    type: BackendTypeNames.FILE_SET,
    files: [],
  },
  project: null,
  publisher: { id: '' },
};
