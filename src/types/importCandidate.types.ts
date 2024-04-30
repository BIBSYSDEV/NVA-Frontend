import { AggregationValue, UnconfirmedOrganization } from './common.types';
import { Contributor } from './contributor.types';
import { Organization } from './organization.types';
import { ArtisticPublicationInstance } from './publication_types/artisticRegistration.types';
import { BookPublicationInstance } from './publication_types/bookRegistration.types';
import { ChapterPublicationInstance } from './publication_types/chapterRegistration.types';
import { DegreePublicationInstance } from './publication_types/degreeRegistration.types';
import { ExhibitionPublicationInstance } from './publication_types/exhibitionContent.types';
import { JournalPublicationInstance } from './publication_types/journalRegistration.types';
import { MediaContributionPeriodicalPublicationInstance } from './publication_types/mediaContributionRegistration.types';
import { MapPublicationInstance } from './publication_types/otherRegistration.types';
import { PresentationPublicationInstance } from './publication_types/presentationRegistration.types';
import { ReportPublicationInstance } from './publication_types/reportRegistration.types';
import { ResearchDataPublicationInstance } from './publication_types/researchDataRegistration.types';
import { Journal, Publisher, Registration } from './registration.types';

export type ImportCandidateStatus = 'IMPORTED' | 'NOT_IMPORTED' | 'NOT_APPLICABLE';

export interface ImportStatus {
  candidateStatus: ImportCandidateStatus;
  modifiedDate?: string;
  setBy?: string;
  nvaPublicationId?: string;
  comment?: string;
}

export interface ImportCandidate extends Registration {
  type: 'ImportCandidate';
  importStatus: ImportStatus;
}

interface ImportCandidateStatusBucket {
  key: ImportCandidateStatus;
  docCount: number;
}

export interface ImportCandidateAggregations {
  importStatus: AggregationValue<ImportCandidateStatus>[];
}

export interface ImportCandidateSummary {
  type: 'ImportCandidateSummary';
  createdDate: string;
  id: string;
  additionalIdentifiers: string[];
  importStatus: ImportStatus;
  doi: string;
  publicationYear: string;
  mainTitle: string;
  totalContributors: number;
  totalVerifiedContributors: number;
  organizations: (Pick<Organization, 'type' | 'id' | 'labels'> | UnconfirmedOrganization)[];
  publisher: Pick<Publisher, 'id' | 'name'>;
  journal: Pick<Journal, 'id'>;
  publicationInstance: PublicationInstance;
  contributors: Contributor[];
  printIssn?: string;
  onlineIssn?: string;
}

type PublicationInstance =
  | JournalPublicationInstance
  | DegreePublicationInstance
  | BookPublicationInstance
  | ReportPublicationInstance
  | ChapterPublicationInstance
  | PresentationPublicationInstance
  | ArtisticPublicationInstance
  | MediaContributionPeriodicalPublicationInstance
  | ResearchDataPublicationInstance
  | MapPublicationInstance
  | ExhibitionPublicationInstance;
