import { Organization } from './organization.types';
import { JournalPublicationInstance } from './publication_types/journalRegistration.types';
import { DegreePublicationInstance } from './publication_types/degreeRegistration.types';
import { BookPublicationInstance } from './publication_types/bookRegistration.types';
import { ReportPublicationInstance } from './publication_types/reportRegistration.types';
import { ChapterPublicationInstance } from './publication_types/chapterRegistration.types';
import { PresentationPublicationInstance } from './publication_types/presentationRegistration.types';
import { ArtisticPublicationInstance } from './publication_types/artisticRegistration.types';
import { MediaContributionPeriodicalPublicationInstance } from './publication_types/mediaContributionRegistration.types';
import { ResearchDataPublicationInstance } from './publication_types/researchDataRegistration.types';
import { MapPublicationInstance } from './publication_types/otherRegistration.types';
import { ExhibitionPublicationInstance } from './publication_types/exhibitionContent.types';
import {
  EntityDescription,
  Funding,
  Journal,
  Publisher,
  RegistrationPublisher,
  RegistrationStatus,
} from './registration.types';
import { ResearchProject } from './project.types';
import { AssociatedArtifact } from './associatedArtifact.types';

export enum ImportStatus {
  Imported = 'IMPORTED',
  NotImported = 'NOT_IMPORTED',
  NotApplicable = 'NOT_APPLICABLE',
}

export interface ImportCandidate {
  readonly type: 'ImportCandidate';
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
  entityDescription?: EntityDescription;
  importStatus: ImportStatus;
}

export interface ExpandedImportCandidate {
  type: 'ImportCandidate';
  id: string;
  additionalIdentifiers: string[];
  importStatus: ImportStatus;
  doi: string;
  publicationYear: string;
  mainTitle: string;
  totalContributors: number;
  totalVerifiedContributors: number;
  organizations: Organization[];
  publisher: Pick<Publisher, 'id' | 'name'>;
  journal: Pick<Journal, 'id'>;
  publicationInstance: PublicationInstance;
}

export type PublicationInstance =
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
