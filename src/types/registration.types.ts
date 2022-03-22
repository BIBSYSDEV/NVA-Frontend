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
import { PresentationEntityDescription } from './publication_types/presentationRegistration.types';
import { ArtisticEntityDescription } from './publication_types/artisticRegistration.types';
import { MessageCollection } from './publication_types/messages.types';

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
  level: string;
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

export interface DoiRequest {
  type: 'DoiRequest';
  createdDate: string;
  modifiedDate: string;
  status: DoiRequestStatus;
  messages?: MessageCollection;
}

interface RegistrationPublisher {
  id: string;
}

export interface BaseRegistration extends RegistrationFileSet {
  readonly type: 'Publication';
  readonly id: string;
  readonly identifier: string;
  readonly createdDate: string;
  readonly modifiedDate: string;
  readonly publishedDate?: string;
  readonly resourceOwner: {
    readonly owner: string;
    readonly ownerAffiliation: string;
  };
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
  date?: RegistrationDate;
  description: string;
  language: string;
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

export type EntityDescription =
  | JournalEntityDescription
  | DegreeEntityDescription
  | BookEntityDescription
  | ReportEntityDescription
  | ChapterEntityDescription
  | PresentationEntityDescription
  | ArtisticEntityDescription;

export interface Registration extends BaseRegistration {
  entityDescription?: EntityDescription;
}

export interface RegistrationDate {
  type: 'PublicationDate' | 'IndexDate';
  year: string;
  month: string;
  day: string;
}

export interface RegistrationPreview {
  identifier: string;
  mainTitle: string;
  createdDate: string;
  status: string;
  owner: string;
  publicationDate?: RegistrationDate;
  contributors?: Contributor[];
}

export interface Doi {
  identifier: string; // NVA identifier
  title: string;
}

export const emptyRegistration: Registration = {
  type: 'Publication',
  id: '',
  identifier: '',
  createdDate: '',
  modifiedDate: '',
  resourceOwner: {
    owner: '',
    ownerAffiliation: '',
  },
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
