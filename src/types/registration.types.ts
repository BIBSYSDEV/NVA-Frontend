import { RegistrationFileSet } from './file.types';
import { ResearchProject } from './project.types';
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

export interface Journal {
  id: string;
  identifier: string;
  name: string;
  active: boolean;
  website: string;
  level: string;
  onlineIssn: string | null;
  printIssn: string | null;
  npiDomain: string;
  openAccess: boolean | null;
  language: string | null;
  publisherId: string | null;
}

export interface Publisher {
  id: string;
  identifier: string;
  name: string;
  website: string;
  active: boolean;
}

export interface AlmaRegistration {
  title: string;
}

export interface MyRegistrationsResponse {
  publications?: RegistrationPreview[]; // "publications" is undefined if user has no registrations
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
  subjects: string[];
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
}

export interface NviApplicableBase<T> {
  contentType: T | null;
  peerReviewed: boolean | null;
}

export interface BaseReference {
  type: 'Reference';
  doi: string;
}

export enum PublicationChannelType {
  Journal = 'Journal',
  Publisher = 'Publisher',
  Series = 'Series',
  UnconfirmedJournal = 'UnconfirmedJournal',
  UnconfirmedPublisher = 'UnconfirmedPublisher',
  UnconfirmedSeries = 'UnconfirmedSeries',
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
  subjects: [],
};
