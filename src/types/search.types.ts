import { BookPublicationContext, BookPublicationInstance } from './publication_types/bookRegistration.types';
import { ChapterPublicationContext, ChapterPublicationInstance } from './publication_types/chapterRegistration.types';
import { DegreePublicationContext, DegreePublicationInstance } from './publication_types/degreeRegistration.types';
import { JournalPublicationContext, JournalPublicationInstance } from './publication_types/journalRegistration.types';
import { ReportPublicationContext, ReportPublicationInstance } from './publication_types/reportRegistration.types';
import { RegistrationDate, RegistrationPublisher } from './registration.types';

interface SearchResultContributor {
  id?: string;
  name: string;
}

export interface SearchResult {
  hits: SearchRegistration[];
  took: number;
  total: number;
}

export type SearchPublicationContext = Partial<
  JournalPublicationContext &
    BookPublicationContext &
    ReportPublicationContext &
    DegreePublicationContext &
    ChapterPublicationContext
>;

type SearchPublicationINstance = Partial<
  JournalPublicationInstance &
    BookPublicationInstance &
    ReportPublicationInstance &
    DegreePublicationInstance &
    ChapterPublicationInstance
>;
export interface SearchRegistration {
  id: string;
  contributors: SearchResultContributor[];
  owner: string;
  title: string;
  publicationType: string;
  publisher: RegistrationPublisher;
  publicationDate: RegistrationDate;
  abstract?: string;
  reference?: {
    publicationContext: SearchPublicationContext;
    publicationInstance: SearchPublicationINstance;
  };
}

// Note: These names should match format of SearchRegistration
export enum SearchFieldName {
  ContributorId = 'contributors.id',
  Id = 'id',
  Subtype = 'publicationType',
}
