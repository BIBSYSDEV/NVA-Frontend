import { BackendType, BaseEntityDescription } from '../registration.types';
import { PublicationType, JournalType } from '../publicationFieldNames';
import { LanguageValues } from '../language.types';
import { BackendTypeNames, emptyDate } from './commonRegistration.types';
import { emptyPagesRange, PagesRange } from './pages.types';
import { JournalArticleContentType } from './content.types';

export interface JournalPublicationInstance {
  type: JournalType | '';
  articleNumber: string;
  issue: string;
  pages: PagesRange;
  volume: string;
  corrigendumFor: string;
  contentType: JournalArticleContentType | null;
  peerReviewed: boolean | null;
  originalResearch: boolean | null;
}

export interface JournalPublicationContext {
  type: PublicationType | '';
  level: string | number | null;
  onlineIssn?: string;
  printIssn?: string;
  openAccess: boolean;
  peerReviewed: boolean;
  title: string;
  url?: string;
}

interface JournalReference extends BackendType {
  doi: string;
  publicationContext: JournalPublicationContext;
  publicationInstance: JournalPublicationInstance;
}

export interface JournalEntityDescription extends BaseEntityDescription {
  reference: JournalReference;
}

export const emptyJournalPublicationInstance: JournalPublicationInstance = {
  type: '',
  articleNumber: '',
  issue: '',
  pages: emptyPagesRange,
  peerReviewed: null,
  volume: '',
  corrigendumFor: '',
  contentType: null,
  originalResearch: null,
};

const emptyPublicationContext: JournalPublicationContext = {
  type: '',
  level: '',
  onlineIssn: '',
  openAccess: false,
  peerReviewed: false,
  title: '',
  url: '',
};

const emptyReference: JournalReference = {
  type: BackendTypeNames.REFERENCE,
  doi: '',
  publicationContext: emptyPublicationContext,
  publicationInstance: emptyJournalPublicationInstance,
};

export const emptyRegistrationEntityDescription: JournalEntityDescription = {
  type: BackendTypeNames.ENTITY_DESCRIPTION,
  abstract: '',
  contributors: [],
  date: emptyDate,
  description: '',
  language: LanguageValues.NONE,
  mainTitle: '',
  npiSubjectHeading: '',
  reference: emptyReference,
  tags: [],
  controlledKeywords: [],
};
