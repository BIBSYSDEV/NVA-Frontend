import { AssociatedArtifact } from './associatedArtifact.types';
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
import { MediaContributionEntityDescription } from './publication_types/mediaContributionRegistration.types';
import {
  JournalType,
  BookType,
  ReportType,
  DegreeType,
  ChapterType,
  PresentationType,
  ArtisticType,
  MediaType,
  ResearchDataType,
  OtherRegistrationType,
} from './publicationFieldNames';
import { ResearchDataEntityDescription } from './publication_types/researchDataRegistration.types';
import { MapEntityDescription } from './publication_types/otherRegistration.types';
import { LanguageString } from './common.types';

export enum RegistrationStatus {
  Deleted = 'DRAFT_FOR_DELETION',
  Draft = 'DRAFT',
  New = 'NEW',
  Published = 'PUBLISHED',
  PublishedMetadata = 'PUBLISHED_METADATA',
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
  level?: string;
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
  level?: string;
}

export interface MyRegistrationsResponse {
  publications?: RegistrationPreview[]; // "publications" is undefined if user has no registrations
}

interface RegistrationPublisher {
  id: string;
}

export interface BaseRegistration {
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
  readonly publisher: RegistrationPublisher;
  readonly handle?: string;
  subjects: string[];
  projects: ResearchProject[];
  associatedArtifacts: AssociatedArtifact[];
  fundings: Funding[];
}

export interface Funding {
  type: 'ConfirmedFunding' | 'UnconfirmedFunding';
  source: string;
  id?: string;
  identifier: string;
  labels: LanguageString;
  fundingAmount?: {
    currency: string;
    amount: number;
  };
  activeFrom: string;
  activeTo: string;
}

export const emptyFunding: Funding = {
  type: 'UnconfirmedFunding',
  source: '',
  id: '',
  identifier: '',
  labels: {},
  fundingAmount: {
    currency: 'NOK',
    amount: 0,
  },
  activeFrom: '',
  activeTo: '',
};

export interface BaseEntityDescription {
  type: 'EntityDescription';
  abstract: string;
  alternativeTitles: LanguageString;
  contributors: Contributor[];
  date?: RegistrationDate;
  description: string;
  language: string;
  mainTitle: string;
  npiSubjectHeading: string;
  tags: string[];
}

export interface BaseReference {
  type: 'Reference';
  doi: string;
}

export type PublicationInstanceType =
  | JournalType
  | BookType
  | ReportType
  | DegreeType
  | ChapterType
  | PresentationType
  | ArtisticType
  | MediaType
  | ResearchDataType
  | OtherRegistrationType;

export enum PublicationChannelType {
  Journal = 'Journal',
  MediaContributionPeriodical = 'MediaContributionPeriodical',
  Publisher = 'Publisher',
  Series = 'Series',
  UnconfirmedJournal = 'UnconfirmedJournal',
  UnconfirmedMediaContributionPeriodical = 'UnconfirmedMediaContributionPeriodical',
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
  | ArtisticEntityDescription
  | MediaContributionEntityDescription
  | ResearchDataEntityDescription
  | MapEntityDescription;

export interface Registration extends BaseRegistration {
  entityDescription?: EntityDescription;
}

export interface RegistrationDate {
  type: 'PublicationDate' | 'IndexDate';
  year: string;
  month: string;
  day: string;
}

export const emptyRegistrationDate: RegistrationDate = {
  type: 'PublicationDate',
  year: '',
  month: '',
  day: '',
};

export interface RegistrationPreview {
  id: string;
  mainTitle: string;
  createdDate: string;
  modifiedDate: string;
  status: RegistrationStatus;
  owner: string;
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
  projects: [],
  publisher: { id: '' },
  subjects: [],
  associatedArtifacts: [],
  fundings: [],
};

export interface Series {
  type: PublicationChannelType.Series | PublicationChannelType.UnconfirmedSeries;
  id?: string;
  title?: string;
}

export interface ContextPublisher {
  type: PublicationChannelType.UnconfirmedPublisher | PublicationChannelType.Publisher;
  name?: string;
  id?: string;
}

export const emptyContextPublisher: ContextPublisher = {
  type: PublicationChannelType.Publisher,
  id: '',
};
