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
import { Journal, Publisher, Registration } from './registration.types';

export enum ImportStatus {
  Imported = 'IMPORTED',
  NotImported = 'NOT_IMPORTED',
  NotApplicable = 'NOT_APPLICABLE',
}

export interface ImportCandidate extends Omit<Registration, 'type'> {
  type: 'ImportCandidate';
  importStatus: ImportStatus;
}

export interface ImportCandidateSummary {
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
