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
import { ChapterEntityDescription } from './publication_types/chapterRegistration.types';
import { Contributor } from './contributor.types';
import { LanguageValues } from './language.types';

export enum RegistrationStatus {
  Deleted = 'DRAFT_FOR_DELETION',
  Draft = 'DRAFT',
  New = 'NEW',
  Published = 'PUBLISHED',
}

export enum RegistrationTab {
  Description = 0,
  ResourceType = 1,
  Contributors = 2,
  FilesAndLicenses = 3,
}

// NB! Keys must match supported values in datamodel
export const levelMap: EnumDictionary<string, number | null> = {
  NO_LEVEL: null,
  LEVEL_0: 0,
  LEVEL_1: 1,
  LEVEL_2: 2,
};

export interface Publisher {
  type: string;
  title: string;
  onlineIssn: string;
  printIssn: string;
  level: string | number | null;
  openAccess: boolean;
  peerReviewed: boolean;
  url: string;
}

export interface AlmaRegistration {
  title: string;
}

export interface MyRegistrationsResponse {
  publications?: RegistrationPreview[]; // "publications" is undefined if user has no registrations
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

interface DoiRequestMessage {
  text: string;
  author: string;
  timestamp: string;
}

interface DoiRequest {
  type: string;
  createdDate: string;
  modifiedDate: string;
  status: DoiRequestStatus;
  messages?: DoiRequestMessage[];
}

export interface RegistrationPublisher {
  id: string;
}

export interface BaseRegistration extends RegistrationFileSet {
  readonly type: 'Publication';
  readonly identifier: string;
  readonly createdDate: string;
  readonly modifiedDate: string;
  readonly publishedDate?: string;
  readonly owner: string;
  readonly status: RegistrationStatus;
  readonly doi?: string;
  readonly doiRequest?: DoiRequest;
  readonly publisher: RegistrationPublisher;
  projects: ResearchProject[];
}

export interface BaseEntityDescription {
  type: 'EntityDescription';
  abstract: string;
  contributors: Contributor[];
  date: RegistrationDate;
  description: string;
  language: LanguageValues;
  mainTitle: string;
  npiSubjectHeading: string;
  tags: string[];
  controlledKeywords: string[];
}

export interface NviApplicableBase<T> {
  contentType: T | null;
  peerReviewed: boolean | null;
  originalResearch: boolean | null;
}

export interface BaseReference {
  type: 'Reference';
  doi: string;
}

export interface Registration extends BaseRegistration {
  entityDescription:
    | JournalEntityDescription
    | DegreeEntityDescription
    | BookEntityDescription
    | ReportEntityDescription
    | ChapterEntityDescription;
}

export interface RegistrationDate {
  type: 'PublicationDate' | 'IndexDate';
  year: string;
  month: string;
  day: string;
}

export type RegistrationPreview = Pick<
  Registration & JournalEntityDescription,
  'identifier' | 'mainTitle' | 'createdDate' | 'status' | 'owner'
>;

export interface Doi {
  identifier: string; // NVA identifier
  title: string;
}

export const emptyRegistration: Registration = {
  type: 'Publication',
  identifier: '',
  createdDate: '',
  modifiedDate: '',
  owner: '',
  status: RegistrationStatus.New,
  entityDescription: emptyRegistrationEntityDescription,
  fileSet: {
    type: 'FileSet',
    files: [],
  },
  projects: [],
  publisher: { id: '' },
};
