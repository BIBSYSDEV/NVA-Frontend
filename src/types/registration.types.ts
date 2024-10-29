import { AssociatedArtifact } from './associatedArtifact.types';
import { AggregationValue, LanguageString } from './common.types';
import { Contributor } from './contributor.types';
import { ResearchProject } from './project.types';
import { ArtisticEntityDescription, ArtisticPublicationInstance } from './publication_types/artisticRegistration.types';
import { BookEntityDescription, BookPublicationInstance } from './publication_types/bookRegistration.types';
import { ChapterEntityDescription, ChapterPublicationInstance } from './publication_types/chapterRegistration.types';
import { DegreeEntityDescription, DegreePublicationInstance } from './publication_types/degreeRegistration.types';
import {
  ExhibitionEntityDescription,
  ExhibitionPublicationInstance,
} from './publication_types/exhibitionContent.types';
import {
  emptyRegistrationEntityDescription,
  JournalEntityDescription,
  JournalPublicationInstance,
} from './publication_types/journalRegistration.types';
import {
  MediaContributionEntityDescription,
  MediaContributionPeriodicalPublicationInstance,
  MediaContributionPublicationInstance,
} from './publication_types/mediaContributionRegistration.types';
import { MapEntityDescription, MapPublicationInstance } from './publication_types/otherRegistration.types';
import {
  PresentationEntityDescription,
  PresentationPublicationInstance,
} from './publication_types/presentationRegistration.types';
import { ReportEntityDescription, ReportPublicationInstance } from './publication_types/reportRegistration.types';
import {
  ResearchDataEntityDescription,
  ResearchDataPublicationInstance,
} from './publication_types/researchDataRegistration.types';
import {
  ArtisticType,
  BookType,
  ChapterType,
  DegreeType,
  ExhibitionContentType,
  JournalType,
  MediaType,
  OtherRegistrationType,
  PresentationType,
  ReportType,
  ResearchDataType,
} from './publicationFieldNames';

export enum RegistrationStatus {
  DraftForDeletion = 'DRAFT_FOR_DELETION',
  Deleted = 'DELETED',
  Draft = 'DRAFT',
  New = 'NEW',
  Published = 'PUBLISHED',
  PublishedMetadata = 'PUBLISHED_METADATA',
  Unpublished = 'UNPUBLISHED',
}

export enum RegistrationTab {
  Description = 0,
  ResourceType = 1,
  Contributors = 2,
  FilesAndLicenses = 3,
}

export type ScientificValue = 'Unassigned' | 'LevelZero' | 'LevelOne' | 'LevelTwo';

interface PublicationChannel {
  id: string;
  identifier: string;
  name: string;
  onlineIssn?: string;
  printIssn?: string;
  sameAs: string;
  scientificValue: ScientificValue;
  discontinued?: string;
}

export interface Journal extends PublicationChannel {
  type: 'Journal';
}

export interface Series extends PublicationChannel {
  type: 'Series';
}

export interface Publisher extends PublicationChannel {
  type: 'Publisher';
}

export interface MyRegistrationsResponse {
  publications?: RegistrationPreview[]; // "publications" is undefined if user has no registrations
}

type AdditionalIdentifierType = 'CristinIdentifier' | 'ScopusIdentifier' | 'HandleIdentifier';
type ImportSourceName = 'Cristin' | 'Scopus' | 'handle';

export interface AdditionalIdentifier {
  type: AdditionalIdentifierType;
  sourceName: ImportSourceName;
  value: string;
}

export interface ImportDetail {
  importDate: string;
  importSource: ImportSource;
}

interface ImportSource {
  source: ImportSourceName;
  archive?: string;
}

export type RegistrationOperation =
  | 'update'
  | 'delete'
  | 'unpublish'
  | 'republish'
  | 'terminate'
  | 'update-including-files'
  | 'publishing-request-create'
  | 'publishing-request-approve'
  | 'doi-request-create'
  | 'doi-request-approve'
  | 'support-request-create'
  | 'support-request-approve';

export interface UnpublishingNote {
  type: 'UnpublishingNote';
  note: string;
  createdBy: string;
  createdDate: string;
}

interface GeneralPublicationNote {
  type: 'PublicationNote';
  note: string;
}

type PublicationNote = UnpublishingNote | GeneralPublicationNote;

export interface BaseRegistration {
  readonly type: 'Publication' | 'ImportCandidate';
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
  readonly handle?: string;
  readonly additionalIdentifiers?: AdditionalIdentifier[];
  readonly duplicateOf?: string;
  readonly allowedOperations?: RegistrationOperation[];
  readonly publicationNotes?: PublicationNote[];
  readonly importDetails?: ImportDetail[];
  subjects: string[];
  projects: ResearchProject[];
  associatedArtifacts: AssociatedArtifact[];
  fundings: Funding[];
}

export interface Funding {
  type: 'ConfirmedFunding' | 'UnconfirmedFunding';
  source: string;
  id?: string;
  identifier?: string;
  labels: LanguageString;
  fundingAmount?: {
    currency: string;
    amount: number;
  };
  activeFrom?: string;
  activeTo?: string;
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
  alternativeAbstracts: LanguageString;
  alternativeTitles: LanguageString;
  contributors: Contributor[];
  publicationDate?: RegistrationDate;
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
  | ExhibitionContentType
  | OtherRegistrationType;

export type PublicationInstance =
  | JournalPublicationInstance
  | DegreePublicationInstance
  | BookPublicationInstance
  | ReportPublicationInstance
  | ChapterPublicationInstance
  | PresentationPublicationInstance
  | ArtisticPublicationInstance
  | MediaContributionPublicationInstance
  | MediaContributionPeriodicalPublicationInstance
  | ResearchDataPublicationInstance
  | MapPublicationInstance
  | ExhibitionPublicationInstance;

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
  | MapEntityDescription
  | ExhibitionEntityDescription;

export interface Registration extends BaseRegistration {
  entityDescription?: EntityDescription;
}

export interface RegistrationSearchItem {
  id: string;
  identifier: string;
  createdDate: string;
  modifiedDate: string;
  publishedDate?: string;
  status: RegistrationStatus;
  entityDescription: {
    mainTitle: string;
    abstract: string;
    description: string;
    publicationDate?: RegistrationDate;
    contributorsPreview?: Contributor[];
    contributorsCount?: number;
    /** @deprecated Use 'contributorsPreview' and/or 'contributorsCount' instead */
    contributors?: Contributor[]; // TODO: Remove when new format is availble in all enviroments
    reference: {
      publicationInstance: {
        type?: PublicationInstanceType | '';
      };
      publicationContext?: {
        publisher?: ContextPublisher;
        series?: ContextSeries;
      };
    };
  };
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
  abstract: string;
  contributors: Contributor[];
  identifier: string;
  id: string;
  mainTitle: string;
  createdDate: string;
  modifiedDate: string;
  status: RegistrationStatus;
  owner: string;
  publicationInstance?: {
    type: PublicationInstanceType;
  };
}

export interface DoiPreview {
  entityDescription: EntityDescription;
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
  subjects: [],
  associatedArtifacts: [],
  fundings: [],
  allowedOperations: ['update', 'delete', 'unpublish'],
};

export interface ContextSeries {
  type: PublicationChannelType.Series | PublicationChannelType.UnconfirmedSeries;
  id?: string;
  title?: string;
  onlineIssn?: string;
  printIssn?: string;
  issn?: string;
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

export type AggregationFileKeyType = 'hasPublicFiles' | 'noFiles';

export interface RegistrationAggregations {
  topLevelOrganization?: AggregationValue[];
  type?: AggregationValue<PublicationInstanceType>[];
  fundingSource?: AggregationValue[];
  contributor?: AggregationValue[];
  publisher?: AggregationValue[];
  series?: AggregationValue[];
  journal?: AggregationValue[];
  scientificIndex?: AggregationValue[];
  files?: AggregationValue<AggregationFileKeyType>[];
}

export interface ConfirmedDocument {
  type: 'ConfirmedDocument';
  identifier: string;
  sequence?: number;
}

export interface UnconfirmedDocument {
  type: 'UnconfirmedDocument';
  text: string;
  sequence?: number;
}

export const emptyUnconfirmedDocument: UnconfirmedDocument = {
  type: 'UnconfirmedDocument',
  text: '',
};

export type RelatedDocument = ConfirmedDocument | UnconfirmedDocument;

interface UnpublishPublicationRequest {
  type: 'UnpublishPublicationRequest';
  duplicateOf?: string;
  comment: string;
}

interface TerminatePublicationRequest {
  type: 'DeletePublicationRequest';
}

interface RepublishPublicationRequest {
  type: 'RepublishPublicationRequest';
}

export type UpdateRegistrationStatusRequest =
  | UnpublishPublicationRequest
  | TerminatePublicationRequest
  | RepublishPublicationRequest;

interface NpiSubjectSubdomain {
  id: string;
  name: string;
}

export interface NpiSubjectDomain {
  id: string;
  subjectArea: string;
  subdomains: NpiSubjectSubdomain[];
}
